"use client"
import React, { useEffect } from 'react'
import { getReceptorByDocumento } from '@/actions';
import { useOrderAbastecimientoStore } from "@/store";
import { IBillingForm } from '@/interfaces/billing.interface';
import { Constants } from '@/utils';

interface Props {
    formValues: IBillingForm;
    setFormValues: (values: IBillingForm) => void;
}

export const NumeroDocumento = ({ formValues, setFormValues }: Props) => {
    const applyDiscountIfExists = useOrderAbastecimientoStore((state) => state.applyDiscountIfExists);
    const handleChangeNumeroDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, numeroDocumento: event.target.value });
    };    
    const handleKeyNumeroDocumento = async (event: { key: string; preventDefault: () => void; }) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const receptor = await getReceptorByDocumento(formValues.numeroDocumento);
            if(receptor){
                setFormValues({ ...formValues, razonSocial: receptor.razon_social, direccion: receptor.direccion, placa: receptor.placa });
                applyDiscountIfExists(formValues.numeroDocumento)
            }else{
                setFormValues({ ...formValues, razonSocial: '', direccion: '', placa: '' });
            }
        }
    };
    useEffect(() => {
        const { numeroDocumento } = formValues;
        const tipoComprobante = numeroDocumento.length === 11 ? Constants.TIPO_COMPROBANTE.FACTURA : (  numeroDocumento.length === 8 ? Constants.TIPO_COMPROBANTE.BOLETA : '');
        const tipoDocumento = numeroDocumento.length === 11 ? Constants.TIPO_DOCUMENTO.RUC : (  numeroDocumento.length === 8 ? Constants.TIPO_DOCUMENTO.DNI : '');        
        setFormValues({ ...formValues, tipoComprobante, tipoDocumento });
    }, [formValues.numeroDocumento])
    
    return (
        <div className={`${formValues.tipoDocumento === Constants.TIPO_DOCUMENTO.DNI ? 'col-span-2' : 'col-span-1'}`}>
            <label htmlFor="numeroDocumento">{`${formValues.tipoDocumento === Constants.TIPO_DOCUMENTO.RUC ? 'RUC' : formValues.tipoDocumento === Constants.TIPO_DOCUMENTO.DNI ? 'DNI' : 'Número documento'}`}
            </label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded w-full"
                type="text"
                name="numeroDocumento" 
                maxLength={ 11 }
                value={ formValues.numeroDocumento }
                onChange={ handleChangeNumeroDocumento }
                onKeyDown={ handleKeyNumeroDocumento }
            />
        </div>
    )
}
