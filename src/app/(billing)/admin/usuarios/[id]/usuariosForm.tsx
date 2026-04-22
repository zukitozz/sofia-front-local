"use client";
import { Title } from "@/components";
import { saveUsuario } from '@/actions';
import { useState } from 'react';
import { IUser } from '@/interfaces';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

interface Props {
  usuario: IUser
}

export const UsuariosForm = ({ usuario }: Props) => {
    const router = useRouter();
    const [formValues, setFormValues] = useState<IUser>(usuario);
    const newProduct = usuario.id==0;
    const handleChangeNombre = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, nombre: event.target.value });
    };
    const handleChangeUsuario = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, usuario: event.target.value });
    };
    const handleChangeCorreo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, correo: event.target.value });
    };      
    const handlerProcessBilling = async (event: React.FormEvent<HTMLFormElement>) => {
        //TODO: Validar
        event.preventDefault();
        await saveUsuario(formValues);
        router.push('/admin/usuarios')
    }

    return (
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
            <Title title={ newProduct? 'Creación de usuario':'Modificación de usuario' } />
            <Link
              href="/admin/usuarios/"
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoArrowBack size={30} />
              <span className="ml-3 text-xl">Regresar</span>
            </Link>
            <br/>
            <form onSubmit={handlerProcessBilling} autoComplete="off" className="flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                    <div className='col-span-1'>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="nombre"
                            defaultValue={ usuario?.nombre }
                            onChange={ handleChangeNombre }
                        />
                    </div> 
                    <div className='col-span-1'>
                        <label htmlFor="usuario">Usuario</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="usuario" 
                            defaultValue={ usuario?.usuario }
                            onChange={ handleChangeUsuario }
                        />
                    </div>
                    <div className='col-span-1'>
                        <label htmlFor="correo">Correo</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="correo"
                            defaultValue={ usuario?.correo }
                            onChange={ handleChangeCorreo }
                        />
                    </div>
                    <div className='col-span-1'>
                        <label htmlFor="rol">Rol</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="rol"
                            defaultValue={ usuario?.rol }
                            disabled = { !newProduct } 
                        />
                    </div>                    
                    <div className="col-span-2">
                        <button className={`btn-primary px-5 py-2 mt-3 w-full`} disabled={false} type="submit">
                            { newProduct?'Crear usuario':'Editar usuario'}
                        </button>                        
                    </div>                    
                </div>
            </form>
        </div>
      </div>
    );
}