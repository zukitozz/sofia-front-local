"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { saveBilling, saveCheckNc } from "@/actions";
import { Constants, notify, toLocaleStorage } from "@/utils";
import { IBillingForm, IComprobanteAdmin } from "@/interfaces";
import { NumeroDocumento, Placa, RazonSocial, Direccion, TipoPago } from "@/app/(billing)/invoice/[id]/ui/form-values";

interface Props {
        billing: IComprobanteAdmin;
}

export const BillingEditForm = ({ billing }: Props) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);
    
    const { total, items } = billing;

    const form: IBillingForm = {
        tipoComprobante: billing.tipo_comprobante,
        tipoDocumento: billing.Receptor?.tipo_documento || "",
        numeroDocumento: billing.Receptor?.numero_documento || "",
        razonSocial: billing.Receptor?.razon_social || "",
        direccion: billing.Receptor?.direccion || "",
        placa: billing.Receptor?.placa || "",
        efectivo: billing.efectivo,
        tarjeta: billing.tarjeta,
        yape: billing.yape
    }

    const [formValues, setFormValues] = useState<IBillingForm>(form);

    useEffect(() => {
        setFormValues(prevValues => ({ ...prevValues, efectivo: total }));
    }, [total])
    

    const { tipoComprobante, tipoDocumento, numeroDocumento, razonSocial, efectivo, tarjeta, yape } = formValues;

    const getTitle = () => {
        if (tipoDocumento === Constants.TIPO_DOCUMENTO.RUC) return 'NOTA CREDITO FACTURA ELECTRÓNICA';
        if (tipoDocumento === Constants.TIPO_DOCUMENTO.DNI) return 'NOTA CREDITO BOLETA ELECTRÓNICA';
        return 'Datos de venta';
    };

    const validateForm = () => {
        const sumaPagos = Number(efectivo) + Number(tarjeta) + Number(yape);
        if (items.length === 0) {
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
        
        if(!razonSocial || razonSocial.trim() === "0"){
            notify({ message: 'Ingrese la razón social', type: 'error' });
            return false;
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
            //router.push('/historic')
        }
    }

    const procesarComprobante = async () => {
        billing.tipo_comprobante = Constants.TIPO_COMPROBANTE.NOTA_CREDITO;
        billing.numeracion_documento_afectado = billing.numeracion_comprobante || "";
        billing.fecha_documento_afectado = toLocaleStorage(billing.fecha_emision || "");
        billing.tipo_documento_afectado = tipoComprobante;

        billing.fecha_emision = toLocaleStorage(new Date());
        billing.fecha_hora = toLocaleStorage(new Date());
        billing.fecha_abastecimiento = '';
        billing.numeracion_comprobante = "";
        billing.UsuarioId = UsuarioId;
        billing.IslaId = IslaId;
        billing.impresion = 0;
        billing.enviado = 0;
        console.log("Comprobante a guardar:", billing);
        const { status, message, bill } = await saveBilling(billing);

        console.log("Respuesta de saveBilling:", { status, message, bill });
        
        
        if(status && bill){
            console.log("Guardando verificación para NC:", { documento_principal: billing.numeracion_documento_afectado, documento_afectado: bill.numeracion_comprobante });
            const reponse_nc = await saveCheckNc(billing.numeracion_documento_afectado, bill.numeracion_comprobante);    
            console.log("Respuesta de saveCheckNc:", reponse_nc);
            notify({message, type:'success'})
        }else {
            notify({message, type:'error'})
        }
    }
    
    return (
        <>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl mb-2 font-bold text-slate-800">{getTitle()}</h2>
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