"use client";

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { Title } from "@/components";
import { changePassword } from "@/actions";

export const ChangePasswordForm = () => {
    const { data: session } = useSession();
    
    // Estado centralizado para el formulario
    const [formData, setFormData] = useState({
        prevPassword: '',
        password: '',
        confirmPassword: ''
    });

    const [status, setStatus] = useState({
        isLoading: false,
        message: '',
        isError: false
    });

    const { prevPassword, password, confirmPassword } = formData;

    // Manejador único para todos los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar mensaje de error cuando el usuario vuelve a escribir
        if (status.message) setStatus({ ...status, message: '', isError: false });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Validaciones básicas de cliente
        if (!password || !prevPassword || !confirmPassword) {
            return setStatus({ isLoading: false, message: 'Todos los campos son obligatorios', isError: true });
        }

        if (password !== confirmPassword) {
            return setStatus({ isLoading: false, message: 'Las contraseñas nuevas no coinciden', isError: true });
        }

        if (password.length < 6) {
            return setStatus({ isLoading: false, message: 'La contraseña debe tener al menos 6 caracteres', isError: true });
        }

        setStatus({ ...status, isLoading: true });

        const usuarioId = Number(session?.user?.id) || 0;
        const isla = session?.user?.isla || 'unknown';

        try {
            const result = await changePassword(usuarioId, prevPassword, password, isla);

            if (!result.success) {
                setStatus({ isLoading: false, message: result.message, isError: true });
                return;
            }

            // Éxito
            setStatus({ isLoading: false, message: '¡Contraseña actualizada con éxito!', isError: false });
            setFormData({ prevPassword: '', password: '', confirmPassword: '' }); // Limpiar form
            
        } catch (error) {
            setStatus({ isLoading: false, message: 'Error inesperado en el servidor', isError: true });
        }
    };

    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-full max-w-[500px]">
                <form onSubmit={handleSubmit} className="flex flex-col mt-5">
                    <div className="grid grid-cols-1 gap-4">
                        
                        <div className='flex flex-col'>
                            <label className="mb-1 text-sm font-medium" htmlFor="prevPassword">Contraseña anterior</label>
                            <input
                                id="prevPassword"
                                name="prevPassword"
                                type="password"
                                className="px-4 py-2 border bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={prevPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="mb-1 text-sm font-medium" htmlFor="password">Nueva contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="px-4 py-2 border bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label className="mb-1 text-sm font-medium" htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                className="px-4 py-2 border bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                value={confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mt-2">
                            {status.message && (
                                <div className={`p-2 text-sm rounded mb-3 ${status.isError ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {status.message}
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={status.isLoading}
                                className={`flex justify-center items-center gap-2 w-full px-5 py-2 rounded text-white transition-colors 
                                    ${status.isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {status.isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                {status.isLoading ? 'Procesando...' : 'Actualizar contraseña'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}