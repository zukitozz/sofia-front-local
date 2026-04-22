"use client";
import { Title } from "@/components";
import { saveReceptor } from '@/actions';
import { useState } from 'react';
import { IReceptor } from '@/interfaces';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

interface Props {
  receptor: IReceptor
}

export const ReceptoresForm = ({ receptor }: Props) => {
    const router = useRouter();
    const [formValues, setFormValues] = useState<IReceptor>(receptor);
    const newProduct = receptor.id==0;
    const handleChangeTipoDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, tipo_documento: event.target.value });
    };
    const handleChangeNumeroDocumento = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, numero_documento: event.target.value });
    };    
    const handleChangeRazonSocial = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, razon_social: event.target.value });
    };
    const handleChangeDireccion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, direccion: event.target.value });
    };
    const handleChangeCorreo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, correo: event.target.value });
    };      
    const handlerProcessBilling = async (event: React.FormEvent<HTMLFormElement>) => {
        //TODO: Validar
        event.preventDefault();
        await saveReceptor(formValues);
        router.push('/admin/receptores')
    }

    return (
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
            <Title title={ newProduct? 'Creación de clientes':'Modificación de clientes' } />
            <Link
              href="/admin/receptores/"
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoArrowBack size={30} />
              <span className="ml-3 text-xl">Regresar</span>
            </Link>
            <br/>
            <form onSubmit={handlerProcessBilling} autoComplete="off" className="flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                    <div className='col-span-1'>
                        <label htmlFor="tipo_documento">TipoDocumento</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="tipo_documento"
                            defaultValue={ receptor?.tipo_documento }
                            onChange={ handleChangeTipoDocumento }
                            disabled = { !newProduct } 
                        />
                    </div>
                    <div className='col-span-1'>
                        <label htmlFor="numero_documento">NumeroDocumento</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="numero_documento"
                            defaultValue={ receptor?.numero_documento }
                            onChange={ handleChangeNumeroDocumento }
                            disabled = { !newProduct } 
                        />
                    </div>                     
                    <div className='col-span-1'>
                        <label htmlFor="razon_social">RazonSocial</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="razon_social" 
                            defaultValue={ receptor?.razon_social }
                            onChange={ handleChangeRazonSocial }
                        />
                    </div>
                    <div className='col-span-1'>
                        <label htmlFor="correo">Correo</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="correo"
                            defaultValue={ receptor?.correo }
                            onChange={ handleChangeCorreo }
                        />
                    </div>                     
                    <div className='col-span-2'>
                        <label htmlFor="direccion">Direccion</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="direccion"
                            defaultValue={ receptor?.direccion }
                            onChange={ handleChangeDireccion }
                        />
                    </div>                   
                    <div className="col-span-2">
                        <button className={`btn-primary px-5 py-2 mt-3 w-full`} disabled={false} type="submit">
                            { newProduct?'Crear cliente':'Editar cliente'}
                        </button>                        
                    </div>                    
                </div>
            </form>
        </div>
      </div>
    );
}