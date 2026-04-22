'use client'
import { useState, useEffect } from 'react';
import { IBillingForm } from '@/interfaces/billing.interface';
import { Constants } from '@/utils';

interface Props {
    formValues: IBillingForm;
    state: boolean;
    setFormValues: (values: IBillingForm) => void;
}

export const FloatingMenu = ({ formValues, setFormValues, state }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('Opciones');
    const handlerNotaDespacho = () => {
        setFormValues({ ...formValues, tipoComprobante: Constants.TIPO_COMPROBANTE.NOTA_DESPACHO });
        setTitle('Nota de despacho');
        setIsOpen(false);
    }

    const handlerCalibracion = () => {
        setFormValues({ ...formValues, tipoComprobante: Constants.TIPO_COMPROBANTE.CALIBRACION });
        setTitle('Calibración');
        setIsOpen(false);
    }

    const handlerCancelar = () => {
        setTitle('Opciones');
        setIsOpen(false);
        const { numeroDocumento } = formValues;
        const tipoComprobante = numeroDocumento.length === 11 ? Constants.TIPO_COMPROBANTE.FACTURA : (  numeroDocumento.length === 8 ? Constants.TIPO_COMPROBANTE.BOLETA : '');
        setTitle(tipoComprobante === Constants.TIPO_COMPROBANTE.FACTURA ? 'Factura' : 'Boleta');
        setFormValues({ ...formValues, tipoComprobante });
    }

    useEffect(() => { 
        switch (formValues.tipoComprobante) {
            case Constants.TIPO_COMPROBANTE.NOTA_DESPACHO:
                setTitle('Nota de despacho');
                break;
            case Constants.TIPO_COMPROBANTE.CALIBRACION:
                setTitle('Calibración');
                break;
            case Constants.TIPO_COMPROBANTE.FACTURA:
                setTitle('Factura');
                break;
            case Constants.TIPO_COMPROBANTE.BOLETA:
                setTitle('Boleta');
                break;
            default:
                break;
        }
    }, [formValues.tipoComprobante])
    
    return (
        <div className="relative bottom-2 right-2 z-50 flex flex-col items-end gap-4">
        <button 
            onClick={() => setIsOpen(!isOpen)} 
            disabled={state}
            className="bg-blue-600 text-white p-2 rounded-md shadow-xl"
        >
            {isOpen ? `Cerrar` : `${title}` }
        </button>
        {isOpen && (
            <div className="absolute bottom-8 right-8 flex flex-col gap-2 bg-white p-4 shadow-md rounded-md z-0">
                <button onClick={handlerNotaDespacho}>Nota de despacho</button>
                <button onClick={handlerCalibracion}>Calibración</button>
                <button onClick={handlerCancelar}>Cancelar</button>
            </div>
        )}      
        </div>
    );
}
