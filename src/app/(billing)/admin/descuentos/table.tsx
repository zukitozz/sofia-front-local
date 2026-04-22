'use client';
import useSWR from 'swr';
import { getDescuentos } from '@/actions'
import { IDescuentoTable } from '@/interfaces';
import Link from 'next/link';
import { SetStateAction, useEffect, useState } from 'react';
import { currencyFormat } from '@/utils';


interface TableProps {
  page: number;
  perPage: number;
  keyword?: string;
}

const fetcher = (page: number, perPage: number, keyword?: string) => getDescuentos(page, perPage, keyword);

export const DescuentosTable = ({ page, perPage, keyword }: TableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, error, isValidating, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api`, (url: string) => fetcher(currentPage, 10, keyword));
    useEffect(() => {
        mutate()
    }, [currentPage])    
    const paginate = (pageNumber: SetStateAction<number>) => { setCurrentPage(pageNumber) };
    if(!data || isLoading || isValidating || error || !Array.isArray(data.descuentos) || !Array.isArray(data.pageNumbers)){
        return (<div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>);
    }    
    
    return (
        <>
        <div className="mb-2">
            <Link href={ `/admin/descuentos/0` }>
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
                    Cliente
                </th>                
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Producto
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Monto descuento
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Estado
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
                {data.descuentos?.map((item : IDescuentoTable) => (
                <tr
                    key={item.id}
                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.cliente}
                    </td>                    
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.descripcion_producto}
                    </td>                                   
                    <td className="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap text-right">
                        {currencyFormat(item.monto_descuento)}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.estado == 1 ? "Activo" : "Inactivo"}
                    </td>                    
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        <Link href={ `/admin/descuentos/${ item.id }` }>
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

export default DescuentosTable;