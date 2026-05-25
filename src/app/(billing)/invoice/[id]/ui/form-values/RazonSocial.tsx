import { getReceptorByRazonSocial } from '@/actions';
import { IBillingForm } from '@/interfaces/billing.interface';
import React, { useState } from 'react'
import { SuggestionInput } from './SuggestionInput';
import { IReceptor } from '@/interfaces';
import { Constants } from '@/utils/constants';
interface Props {
    formValues: IBillingForm;
    setFormValues: (values: IBillingForm) => void;
    isDisabled?: boolean;
}

export const RazonSocial = ({ formValues, setFormValues, isDisabled }: Props) => {

    const [suggestions, setSuggestions] = useState<IReceptor[]>([]); 

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {       
        const value = event.target.value;
        setFormValues({ ...formValues, razonSocial: value });
        if(value.length > 2){
            const allSuggestions = await getReceptorByRazonSocial(value);
            const filtredSuggestions = allSuggestions.filter(receptor => receptor.razon_social.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(filtredSuggestions);
        }else{
            setSuggestions([]);
        }
    };
    
    const handleSelectSuggestion = (suggestion: IReceptor) => {
        const tipoComprobante = suggestion.numero_documento.length === 11 ? Constants.TIPO_COMPROBANTE.FACTURA : Constants.TIPO_COMPROBANTE.BOLETA;
        const tipoDocumento = suggestion.numero_documento.length === 11 ? Constants.TIPO_DOCUMENTO.RUC : Constants.TIPO_DOCUMENTO.DNI;        
        setFormValues({ ...formValues, razonSocial: suggestion.razon_social, numeroDocumento: suggestion.numero_documento, direccion: suggestion.direccion, tipoComprobante, tipoDocumento, placa: suggestion.placa });
        setSuggestions([]);
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
                className="px-5 py-2 border bg-gray-200 rounded w-full"
                type="text"
                name="razonSocial" 
                value={ formValues.razonSocial }
                onChange={ handleChange } 
                onKeyDown={ handleKeyDown }
                disabled={isDisabled}
            />
            <SuggestionInput suggestions={suggestions} onSelect={handleSelectSuggestion}/>
        </div>
    )
}
