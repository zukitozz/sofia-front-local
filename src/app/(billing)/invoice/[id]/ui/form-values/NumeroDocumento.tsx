"use client"
import React, { useEffect, useState } from 'react'
import { getReceptorByDocumento } from '@/actions';
import { useOrderAbastecimientoStore } from "@/store";
import { IBillingForm } from '@/interfaces/billing.interface';
import { Constants, consultaRucMiFact, notify } from '@/utils';
import { IoPricetag } from 'react-icons/io5';

interface Props {
    formValues: IBillingForm;
    setFormValues: (values: IBillingForm) => void;
}

export const NumeroDocumento = ({ formValues, setFormValues }: Props) => {
    
    const applyDiscountIfExists = useOrderAbastecimientoStore((state) => state.applyDiscountIfExists);
    const lockBilling = useOrderAbastecimientoStore((state) => state.lockBilling);
    const isBillingBlocked = useOrderAbastecimientoStore((state) => state.isBillingBlocked);

    const [hasDiscount, setHasDiscount] = useState(false);

    const handleChangeNumeroDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, numeroDocumento: event.target.value });
        if (hasDiscount) setHasDiscount(false);
    };    
    const handleKeyNumeroDocumento = async (event: { key: string; preventDefault: () => void; }) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if(formValues.tipoDocumento){
                const receptor = await getReceptorByDocumento(formValues.numeroDocumento);
                if(receptor){
                    console.log("Receptor encontrado para el documento", formValues.numeroDocumento, receptor);
                    notify({message: "Cargando datos del cliente", type:'success'})
                    setFormValues({ ...formValues, razonSocial: receptor.razon_social, direccion: receptor.direccion, placa: receptor.placa });
                }else{
                    console.log("No se encontró receptor para el documento, consultando RUC en MiFact", formValues.numeroDocumento);
                    const {hasErrorMiFact, razon_social, direccion} = await consultaRucMiFact(formValues.numeroDocumento);
                    if(!hasErrorMiFact && razon_social && direccion){
                        notify({message: "Cargando datos de SUNAT", type:'success'})
                        setFormValues({ ...formValues, razonSocial: razon_social, direccion: direccion });
                    }else{
                        notify({message: "Ruc no encontrado se realiza el registro", type:'success'})
                        setFormValues({ ...formValues, razonSocial: '', direccion: '', placa: '' });
                    } 
                    const { status } = await applyDiscountIfExists(formValues.numeroDocumento);
                    if(status){
                        notify({message: "Descuento aplicado", type:'success'});
                    }
                    setHasDiscount(status);
                    lockBilling();
                }
                
            }else{
                notify({message: "Número de documento no válido", type:'error'})
                setFormValues({ ...formValues, razonSocial: '', direccion: '', placa: '' });
                setHasDiscount(false);
            }

        }
    };
    useEffect(() => {
        const { numeroDocumento } = formValues;
        const tipoComprobante = numeroDocumento.length === 11 ? Constants.TIPO_COMPROBANTE.FACTURA : (  (numeroDocumento.length === 8 || numeroDocumento === "0") ? Constants.TIPO_COMPROBANTE.BOLETA : '');
        const tipoDocumento = numeroDocumento.length === 11 ? Constants.TIPO_DOCUMENTO.RUC : (  (numeroDocumento.length === 8 || numeroDocumento === "0") ? Constants.TIPO_DOCUMENTO.DNI : '');        
        setFormValues({ ...formValues, tipoComprobante, tipoDocumento });
    }, [formValues.numeroDocumento])
    
    return (
        <div className='col-span-1'>
            <label htmlFor="numeroDocumento">{`${formValues.tipoDocumento === Constants.TIPO_DOCUMENTO.RUC ? 'RUC' : formValues.tipoDocumento === Constants.TIPO_DOCUMENTO.DNI ? 'DNI' : 'Número documento'}`}
            </label>
            <input
                className={`px-5 py-2 border rounded w-full transition-all outline-none ${
                    hasDiscount 
                    ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200 shadow-inner' 
                    : 'border-gray-300 bg-gray-200 focus:bg-white'
                }`}
                type="text"
                name="numeroDocumento" 
                maxLength={ 11 }
                value={ formValues.numeroDocumento }
                onChange={ handleChangeNumeroDocumento }
                onKeyDown={ handleKeyNumeroDocumento }
                autoComplete="off"
                disabled={isBillingBlocked}
            />
            {hasDiscount && (
                <div className="flex items-center animate-bounce">
                    <span className="flex h-2 w-2 mr-1">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center shadow-sm">
                        <IoPricetag className="mr-1" /> DESCUENTO APLICADO
                    </span>
                </div>
            )}            
        </div>
    )
}
