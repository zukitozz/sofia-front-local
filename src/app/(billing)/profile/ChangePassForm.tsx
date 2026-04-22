
"use client";
import { Title } from "@/components";
import { useState } from 'react';
import { changePassword } from "@/actions";
import { useSession } from "next-auth/react";


export const ChangePasswordForm = () => {
    const { data: session } = useSession();
    const [password, setPassword] = useState<string>('');
    const [prevPassword, setPrevPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const handleChangePrevPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrevPassword(event.target.value);
    };

    const handleChangeConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };    

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handlerProcessPassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        if(!password || !prevPassword) {
            setMessage('Por favor complete todos los campos de contraseña');
            setIsLoading(false);
            return;
        }
        if (password != confirmPassword) {
            setMessage('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }
        const UsuarioId: number = session?.user?.id ? +session.user.id : 0;
        const isla = session?.user?.isla || 'unknown';
        const result = await changePassword(UsuarioId, prevPassword, password, isla);
        if( !result.success ) {
            setMessage(result.message);
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
    }

    return(
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[500px]">
            <Title title="Cambio de contraseña" />
            <br/>
            <form onSubmit={handlerProcessPassword} autoComplete="off" className="flex flex-col">
                <div className="grid grid-cols-1 gap-3">
                    <div className='col-span-1'>
                        <label htmlFor="concepto">Ingrese anterior contraseña</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="password"
                            name="concepto"
                            defaultValue={ prevPassword }
                            onChange={ handleChangePrevPassword }
                        />
                    </div>                    
                    <div className='col-span-1'>
                        <label htmlFor="concepto">Ingrese su nueva contraseña</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="password"
                            name="concepto"
                            defaultValue={ password }
                            onChange={ handleChangePassword }
                        />
                    </div>
                    <div className='col-span-1'>
                        <label htmlFor="concepto">Repita su nueva contraseña</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="password"
                            name="concepto"
                            defaultValue={ confirmPassword }
                            onChange={ handleChangeConfirmPassword }
                        />
                    </div>                 
                    <div className="col-span-1">
                        {isLoading && (
                            <div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>
                        )}

                        <button className={`btn-primary px-5 py-2 mt-3 w-full`} disabled={isLoading} type="submit">
                            Cambiar contraseña
                        </button>
                        {message.length > 0 && (
                            <p style={{ color: 'red' }}>{message}</p>
                        )}                          
                    </div>                    
                </div>
            </form>
        </div>
      </div>        
    )
}