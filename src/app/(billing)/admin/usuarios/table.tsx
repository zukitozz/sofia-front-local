'use client';
import useSWR from 'swr';
import { getUsuarios } from '@/actions'
import { IUser } from '@/interfaces';
import Link from 'next/link';
import { SetStateAction, useEffect, useState } from 'react';


interface TableProps {
  page: number;
  perPage: number;
  keyword?: string;
}

const fetcher = (page: number, perPage: number, keyword?: string) => getUsuarios(page, perPage, keyword);

export const UsuariosTable = ({ page, perPage, keyword }: TableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, error, isValidating, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api`, (url: string) => fetcher(currentPage, 10, keyword));
    useEffect(() => {
        mutate()
    }, [currentPage])    
    const paginate = (pageNumber: SetStateAction<number>) => { setCurrentPage(pageNumber) };
    if(!data || isLoading || isValidating || error || !Array.isArray(data.usuarios) || !Array.isArray(data.pageNumbers)){
        return (<div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>);
    }    
    
    return (
        <>
        <div className="mb-2">
            <Link className="btn-primary px-5 py-2 mt-3" href={ `/admin/usuarios/0` }>
                Nuevo
            </Link>            
        </div>
        <div className="mb-10">
            <table className="min-w-full">
            <thead className="bg-gray-200 border-b">
                <tr>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    #ID
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Nombre
                </th>                
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Usuario
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Correo
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Rol
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Modificar
                </th>
                </tr>
            </thead>
            <tbody>
                {data.usuarios?.map((item : IUser) => (
                <tr
                    key={item.id}
                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.nombre}
                    </td>                    
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.usuario}
                    </td>                                   
                    <td className="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.correo}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        {item.rol}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        <Link className="btn-primary px-5 py-2 mt-3" href={ `/admin/usuarios/${ item.id }` }>
                            Modificar
                        </Link>
                    </td>                    
                </tr>
                ))}

                
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={6}>
                        <div className="flex items-center justify-center" >
                            {data.pageNumbers.map(number => (
                            <button key={number} className='p-1' onClick={() => paginate(number)} style={{ fontWeight: currentPage === number ? 'bold' : 'normal' }}>
                                {number}
                            </button>
                            ))}
                        </div>
                    </td>
                </tr>

            </tfoot>
            </table>
        </div>
        </>
    );
}

export default UsuariosTable;