import React from 'react'
import { IBillingForm } from '@/interfaces';
import { FaRegCreditCard } from 'react-icons/fa';
import { MdSmartphone } from 'react-icons/md';
import { RiMoneyDollarBoxFill } from 'react-icons/ri';

interface Props {
    total: number;
    formValues: IBillingForm;
    setFormValues: (values: IBillingForm) => void;
}
export const TipoPago = ({ total, formValues, setFormValues }: Props) => {

    const handleChangeEfectivo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        if (val === '') {
            setFormValues({ ...formValues, efectivo: '' });
            return;
        }
        setFormValues({ ...formValues, efectivo: +event.target.value });
    };
    const handleChangeTarjeta = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        if (val === '') {
            setFormValues({ ...formValues, tarjeta: '' });
            return;
        }
        setFormValues({ ...formValues, tarjeta: +event.target.value });
    };
    const handleChangeYape = (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value;
        if (val === '') {
            setFormValues({ ...formValues, yape: '' });
            return;
        }
        setFormValues({ ...formValues, yape: +event.target.value });
    };        
    const handleKeyDown = async (event: { key: string; preventDefault: () => void; }) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };
    const handlePressEfectivo = () => {
        setFormValues({ ...formValues, efectivo: total, tarjeta: 0, yape: 0  });
    };
    const handlePressTarjeta = () => {
        setFormValues({ ...formValues, tarjeta: total, efectivo: 0, yape: 0 });
    };
    const handlePressYape = () => {
        setFormValues({ ...formValues, yape: total, efectivo: 0, tarjeta: 0});
    };        
    return (
        <div className="col-span-2">
            <label htmlFor="direccion">Tipo pago</label>
            <div className="grid grid-cols-3 gap-2">
                <div className="grid grid-cols-5">
                    <div className='col-span-1 flex justify-center items-center' style={{ color: 'green' }}>
                        <RiMoneyDollarBoxFill size={30} className="cursor-pointer" onClick={() => handlePressEfectivo()}/>
                    </div>
                    <input
                        className="col-span-4 px-5 py-2 border bg-gray-200 rounded w-full"
                        type="number"
                        name="efectivo"
                        value={ formValues.efectivo }
                        onChange={ handleChangeEfectivo }
                        onKeyDown={ handleKeyDown }
                    />                        
                </div>
                <div className="grid grid-cols-5">
                    <div className='col-span-1 flex justify-center items-center' style={{ color: 'blue' }}>
                        <FaRegCreditCard size={30} className="cursor-pointer" onClick={() => handlePressTarjeta()}/>
                    </div>
                    <input
                        className="col-span-4 px-5 py-2 border bg-gray-200 rounded w-full"
                        type="number"
                        name="tarjeta"
                        value={ formValues.tarjeta }
                        onChange={ handleChangeTarjeta }
                        onKeyDown={ handleKeyDown }
                    /> 
                </div>                
                <div className="grid grid-cols-5">
                    <div className='col-span-1 flex justify-center items-center' style={{ color: 'orange' }}>
                        <MdSmartphone size={30} className="cursor-pointer" onClick={() => handlePressYape()}/>
                    </div>
                    <input
                        className="col-span-4 px-5 py-2 border bg-gray-200 rounded w-full"
                        type="number"
                        name="yape" 
                        value={ formValues.yape }
                        onChange={ handleChangeYape }
                        onKeyDown={ handleKeyDown }
                    />
                </div>
            </div>
        </div>
    )
}
