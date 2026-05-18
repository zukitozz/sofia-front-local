import { getPlacas } from '@/actions';
import { IBillingForm } from '@/interfaces/billing.interface';
import React, { useState } from 'react'
import { IReceptorPlaca } from '@/interfaces';
import { SuggestionPlacaInput } from './SuggestionPlacaInput';
import { Constants } from '@/utils/constants';
interface Props {
    formValues: IBillingForm;
    setFormValues: (values: IBillingForm) => void;
}

export const Placa = ({ formValues, setFormValues }: Props) => {

    const [suggestions, setSuggestions] = useState<IReceptorPlaca[]>([]); 
    const { tipoDocumento } = formValues;

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFormValues({ ...formValues, placa: value.toLocaleUpperCase() });
        if(value.length > 2){
            const allSuggestions = await getPlacas(value);
            const filtredSuggestions = allSuggestions.filter(suggestion => suggestion.placa.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(filtredSuggestions);
        }else{
            setSuggestions([]);
        }

    };
    
    const handleSelectSuggestion = (suggestion: IReceptorPlaca) => {
        const tipoComprobante = suggestion.numero_documento.length === 11 ? Constants.TIPO_COMPROBANTE.FACTURA : Constants.TIPO_COMPROBANTE.BOLETA;
        const tipoDocumento = suggestion.numero_documento.length === 11 ? Constants.TIPO_DOCUMENTO.RUC : Constants.TIPO_DOCUMENTO.DNI;
        setFormValues({ ...formValues, placa: suggestion.placa, razonSocial: suggestion.razon_social, numeroDocumento: suggestion.numero_documento, direccion: suggestion.direccion, tipoComprobante, tipoDocumento });
        setSuggestions([]);
    };

    const handleKeyDown = async (event: { key: string; preventDefault: () => void; }) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if(formValues.placa.length === 0 ){
                setFormValues({ ...formValues, numeroDocumento: '', razonSocial: '', direccion: '', placa: ''});
            }
        }
    };    

    return (
        <div className="col-span-1">
            <label htmlFor="placa">Placa</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded w-full"
                type="text"
                name="placa" 
                value={ formValues.placa }
                onChange={ handleChange } 
                onKeyDown={ handleKeyDown }
            />
            <SuggestionPlacaInput suggestions={suggestions} onSelect={handleSelectSuggestion}/>
        </div>
    )
}
