import { getReceptorByDocumento, getReceptorByRazonSocial } from '@/actions';
import { IBillingForm } from '@/interfaces/billing.interface';
import React, { useState } from 'react'
import { SuggestionInput } from './SuggestionInput';
import { IReceptor } from '@/interfaces';
import { Constants } from '@/utils/constants';
import { useOrderAbastecimientoStore } from '@/store';
import { IoPricetag } from 'react-icons/io5';
import { notify } from '@/utils/notify';
interface Props {
    formValues: IBillingForm;
    setFormValues: (values: IBillingForm) => void;
}

export const RazonSocial = ({ formValues, setFormValues }: Props) => {

    const applyDiscountIfExists = useOrderAbastecimientoStore((state) => state.applyDiscountIfExists);
    const lockBilling = useOrderAbastecimientoStore((state) => state.lockBilling);
    const isBillingBlocked = useOrderAbastecimientoStore((state) => state.isBillingBlocked);

    const [suggestions, setSuggestions] = useState<IReceptor[]>([]); 

    const [hasDiscount, setHasDiscount] = useState(false);

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {       
        const value = event.target.value;
        setFormValues({ ...formValues, razonSocial: value });
        if (hasDiscount) setHasDiscount(false);
        if(value.length > 2){
            const allSuggestions = await getReceptorByRazonSocial(value);
            const filtredSuggestions = allSuggestions.filter(receptor => receptor.razon_social.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(filtredSuggestions);
        }else{
            setSuggestions([]);
        }
    };
    
    const handleSelectSuggestion = async (suggestion: IReceptor) => {
        const tipoComprobante = suggestion.numero_documento.length === 11 ? Constants.TIPO_COMPROBANTE.FACTURA : Constants.TIPO_COMPROBANTE.BOLETA;
        const tipoDocumento = suggestion.numero_documento.length === 11 ? Constants.TIPO_DOCUMENTO.RUC : Constants.TIPO_DOCUMENTO.DNI;        
        setFormValues({ ...formValues, razonSocial: suggestion.razon_social, numeroDocumento: suggestion.numero_documento, direccion: suggestion.direccion, tipoComprobante, tipoDocumento, placa: suggestion.placa });
        setSuggestions([]);
        const { status } = await applyDiscountIfExists(suggestion.numero_documento);
        setHasDiscount(status);
        if(status){
            notify({message: "Descuento aplicado", type:'success'});
        }
        lockBilling();
    };

    const handleKeyDown = async (event: { key: string; preventDefault: () => void; }) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }; 
   
    return (
        <div className="col-span-2">
            <label htmlFor="razonSocial">{`${formValues.tipoDocumento === Constants.TIPO_DOCUMENTO.RUC ? 'Razon social' : 'Nombre'}`}</label>
            <input
                className={`px-5 py-2 border rounded w-full transition-all outline-none ${
                    hasDiscount 
                    ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200 shadow-inner' 
                    : 'border-gray-300 bg-gray-200 focus:bg-white'
                }`}
                type="text"
                name="razonSocial" 
                value={ formValues.razonSocial }
                onChange={ handleChange } 
                onKeyDown={ handleKeyDown }
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
            <SuggestionInput suggestions={suggestions} onSelect={handleSelectSuggestion}/>
        </div>
    )
}
