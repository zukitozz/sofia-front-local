"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { saveBilling } from "@/actions";
import { useOrderAbastecimientoStore } from "@/store";
import { Constants, initialBillingForm, notify } from "@/utils";
import { Direccion, NumeroDocumento, Placa, RazonSocial, TipoPago } from "./form-values";
import { Comprobante } from "@/model";
import { FloatingMenu } from "./form-values/FloatMenu";
import { IBillingForm, IComprobanteAdminItem, IOrderItem, IReceptor } from "@/interfaces";

interface Props {
    total: number;
    subTotal: number;
    totalIgv: number;
    orders: IOrderItem[];
}

export const BillingForm = ({ orders, subTotal, totalIgv, total }: Props) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);
    const removeAllProducts = useOrderAbastecimientoStore((state) => state.removeAllProducts);

    const [formValues, setFormValues] = useState<IBillingForm>({
        ...initialBillingForm, 
        efectivo: total 
    });

    useEffect(() => {
        setFormValues(prevValues => ({ ...prevValues, efectivo: total }));
    }, [total])
    

    const { tipoComprobante, tipoDocumento, numeroDocumento, razonSocial, placa, direccion, efectivo, tarjeta, yape } = formValues;

    const getTitle = () => {
        if (tipoDocumento === Constants.TIPO_DOCUMENTO.RUC) return 'FACTURA ELECTRÓNICA';
        if (tipoDocumento === Constants.TIPO_DOCUMENTO.DNI) return 'BOLETA ELECTRÓNICA';
        return 'Datos de venta';
    };

    const validateForm = () => {
        const sumaPagos = Number(efectivo) + Number(tarjeta) + Number(yape);
        if (orders.length === 0) {
            notify({ message: 'No hay productos en la orden', type: 'error' });
            return false;
        }

        if (Math.abs(sumaPagos - total) > 0.01) {
            notify({ message: 'La suma de los pagos no coincide con el total', type: 'error' });
            return false;
        }

        if(formValues.numeroDocumento != "0"){
            if(!tipoDocumento){
                notify({ message: 'Ingrese un número de documento de 8 u 11 dígitos', type: 'error' });
                return false;            
            }


            if (tipoDocumento === Constants.TIPO_DOCUMENTO.RUC && numeroDocumento.length !== 11) {
                notify({ message: 'El RUC debe tener 11 dígitos', type: 'error' });
                return false;
            }

            if (tipoDocumento === Constants.TIPO_DOCUMENTO.DNI && numeroDocumento.length !== 8) {
                notify({ message: 'El DNI debe tener 8 dígitos', type: 'error' });
                return false;
            }
        }        



        return true;
    };    

    const UsuarioId = +(session?.user.id || 0);
    const IslaId = +(session?.user.islaId || 0);

    const handlerProcessBilling = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateForm() || isProcessing) return;
        setIsProcessing(true);
        try {
            await procesarComprobante();
        } finally {
            setIsProcessing(false);
            router.push('/')
        }
    }

    const procesarComprobante = async () => {
        const receptor: IReceptor = {
            id: 0,
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
            razon_social: razonSocial,
            direccion: direccion,
            placa: placa
        }
        const items:IComprobanteAdminItem[] = [];
        for (const order of orders) {
            const item:IComprobanteAdminItem = {
                cantidad_string: order.cantidad.toString(),
                precio_unitario_string: order.precio_unitario.toString(),
                valor_unitario_string: order.valor_unitario.toString(),
                igv_string: order.igv.toString(),
                descripcion: order.descripcion,
                codigo_producto: order.codigo_producto,
                medida: order.medida,
                valor_venta: order.valor,
                precio_venta: order.precio,
                valor: order.valor_unitario,
                precio: order.precio_unitario,
                igv_venta: order.igv,
                codigo: 0,
                cantidad_venta: order.cantidad
            };
            items.push(item);
        }
        const order_abastecimiento = orders.find(item => item.id_abastecimiento !== null);
        const fecha_abastecimiento = order_abastecimiento?.fecha_abastecimiento ? new Date(order_abastecimiento.fecha_abastecimiento) : new Date();
        const tiempo_abastecimiento = order_abastecimiento?.tiempo_abastecimiento || 0;
        const id_abastecimiento = order_abastecimiento?.id_abastecimiento || 1;
        const cantidad = order_abastecimiento?.cantidad || 0;
        const codigo_producto = order_abastecimiento?.codigo_producto || "";
        const pistola = order_abastecimiento?.pistola || 0;
        const ruc = process.env.NEXT_PUBLIC_RUC || ""

        const comprobante = new Comprobante(
            receptor, tipoComprobante, subTotal, totalIgv, total, tarjeta, efectivo, yape, ruc, UsuarioId, items, placa, 
            fecha_abastecimiento, tiempo_abastecimiento, IslaId, id_abastecimiento, pistola, codigo_producto, cantidad
        )
        
        const { status, message, bill } = await saveBilling(comprobante.toPlainObject());

        if(status && bill){
            notify({message, type:'success'})
        }else {
            notify({message, type:'error'})
        }
        removeAllProducts();
        router.replace('/');
    }
    
    return (
        <>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl mb-2 font-bold text-slate-800">{getTitle()}</h2>
            <FloatingMenu formValues={formValues} setFormValues={setFormValues} state={formValues.numeroDocumento.length === 0} />
        </div>
        <div className="flex flex-col mt-5">
            <form onSubmit={handlerProcessBilling} autoComplete="off" className="flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                    <NumeroDocumento formValues={formValues} setFormValues={setFormValues} />
                    <Placa formValues={formValues} setFormValues={setFormValues} />
                    <RazonSocial formValues={formValues} setFormValues={setFormValues} />
                    <Direccion formValues={formValues} setFormValues={setFormValues} />
                    <TipoPago total={total} formValues={formValues} setFormValues={setFormValues} />
                    <div className="col-span-2">
                        <button className={`${false ? "btn-disabled" : "btn-primary"} px-5 py-2 mt-3 w-full`} disabled={false}
                        type="submit">
                            {isProcessing ? 'Procesando...' : 'Emitir comprobante'}
                        </button>                        
                    </div>
                </div>
            </form>
        </div>            
        </>
    )
}