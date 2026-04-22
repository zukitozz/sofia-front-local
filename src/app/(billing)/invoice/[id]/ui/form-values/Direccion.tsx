
import { IBillingForm } from '@/interfaces';
import React from 'react'
interface Props {
    formValues: IBillingForm;
    setFormValues: (values: IBillingForm) => void;
}
export const Direccion = ({ formValues, setFormValues }: Props) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, direccion: event.target.value });
    };    
    const handleKeyDown = async (event: { key: string; preventDefault: () => void; }) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };    
    return (
        <div className="col-span-2">
            <label htmlFor="direccion">Dirección</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded w-full"
                type="text"
                name="direccion" 
                value={ formValues.direccion }
                onChange={ handleChange }
                onKeyDown={ handleKeyDown }
            />
        </div>
    )
}
