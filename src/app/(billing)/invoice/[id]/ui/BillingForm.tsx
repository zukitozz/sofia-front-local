"use client";
import { useState } from "react";
import { IBillingForm, IComprobanteAdminItem, IOrderItem, IReceptor } from "@/interfaces";
import { Constants, initialBillingForm, notify, generarTicketComprobante, Print } from "@/utils";
import { Direccion, NumeroDocumento, Placa, RazonSocial, TipoPago } from "./form-values";
import { useSession } from "next-auth/react";
import { saveBilling } from "@/actions";
import { Comprobante } from "@/model";
import { useRouter } from "next/navigation";
import { FloatingMenu } from "./form-values/FloatMenu";
import { useOrderAbastecimientoStore } from "@/store";

interface Props {
    total: number;
    subTotal: number;
    totalIgv: number;
    orders: IOrderItem[];
}

export const BillingForm = ({ orders, subTotal, totalIgv, total }: Props) => {
    const router = useRouter();
    const { data: session } = useSession();
    const removeAllProducts = useOrderAbastecimientoStore((state) => state.removeAllProducts);
    const [formValues, setFormValues] = useState<IBillingForm>({...initialBillingForm, efectivo: total });
    const { tipoComprobante, tipoDocumento, numeroDocumento, razonSocial, placa, direccion, efectivo, tarjeta, yape } = formValues;
    const UsuarioId = +(session?.user.id || 0);

    const handlerProcessBilling = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        procesarComprobante();
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
        const fecha_abastecimiento = order_abastecimiento?.fecha_abastecimiento ? new Date(order_abastecimiento.fecha_abastecimiento) : null;
        const tiempo_abastecimiento = order_abastecimiento?.tiempo_abastecimiento || null;
        const id_abastecimiento = order_abastecimiento?.id_abastecimiento || 1;
        const cantidad = order_abastecimiento?.cantidad || 0;
        const codigo_producto = order_abastecimiento?.codigo_producto || "";
        const pistola = order_abastecimiento?.pistola || 0;
        const ruc = process.env.NEXT_PUBLIC_RUC || ""

        const comprobante = new Comprobante(
            receptor, tipoComprobante, subTotal, totalIgv, total, tarjeta, efectivo, yape, ruc, UsuarioId, items, placa, 
            fecha_abastecimiento, tiempo_abastecimiento, id_abastecimiento, pistola, codigo_producto, cantidad
        )
        const { status, message, bill } = await saveBilling(comprobante.toPlainObject());
        if(status && bill){
            const bytes = generarTicketComprobante(bill);
            removeAllProducts();
            await Print({bytes})            
            notify({message, type:'success'})
        }else {
            notify({message, type:'error'})
        }
        router.push('/')
    }
    
    return (
        <>
        <div className="flex justify-between items-center">
            <div>
            {(() => {
                let title = 'Datos de venta';
                if (formValues.tipoDocumento === Constants.TIPO_DOCUMENTO.RUC) {
                    title = 'FACTURA ELECTRÓNICA';
                } else if (formValues.tipoDocumento === Constants.TIPO_DOCUMENTO.DNI) {
                    title = 'BOLETA ELECTRÓNICA';
                }
                return <h2 className="text-2xl mb-2">{title}</h2>;
            })()}
            </div>
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
                        Emitir comprobante
                        </button>                        
                    </div>
                </div>
            </form>
        </div>            
        </>
    )
}