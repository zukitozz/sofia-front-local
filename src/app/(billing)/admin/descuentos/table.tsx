'use client';
import useSWR from 'swr';
import { getDescuentos } from '@/actions'
import { IDescuentoTable } from '@/interfaces';
import Link from 'next/link';
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import { currencyFormat } from '@/utils';


interface TableProps {
  page: number;
  perPage: number;
  keyword?: string;
}

const fetcher = (page: number, perPage: number, keyword?: string) => getDescuentos(page, perPage, keyword);

const getVisiblePages = (current: number, totalPages: number) => {
    const range = 2; // Cuántas páginas mostrar a los lados de la actual
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || // Siempre mostrar la primera
            i === totalPages || // Siempre mostrar la última
            (i >= current - range && i <= current + range) // Mostrar rango cercano a la actual
        ) {
            pages.push(i);
        } else if (i === current - range - 1 || i === current + range + 1) {
            pages.push('...'); // Agregar puntos suspensivos
        }
    }
    // Eliminar duplicados de '...' en caso de que ocurran
    return pages.filter((item, index) => pages.indexOf(item) === index);
};

export const DescuentosTable = ({ page, perPage, keyword }: TableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [keywordState, setKeyword] = useState<string>(''); 

    const { data, error, isValidating, isLoading } = useSWR(
        [`${process.env.NEXT_PUBLIC_URL}/api`, currentPage, keywordState], 
        () => fetcher(currentPage, 10, keywordState)
    );

    const paginate = (pageNumber: SetStateAction<number>) => { setCurrentPage(pageNumber) };

    const isInitialLoading = (!data && isLoading) || error;


    // if(!data || isLoading || isValidating || error || !Array.isArray(data.descuentos) || !Array.isArray(data.pageNumbers)){
    //     return (<div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>);
    // }    
    
    const totalPages = data?.pageNumbers?.length || 0;
    const visiblePages = getVisiblePages(currentPage, totalPages);
    
    const handleKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1); 
        setKeyword(e.target.value);
    };  

    const renderTable = (descuentos: IDescuentoTable[] | undefined) => {
        if (!descuentos || descuentos.length === 0) {
            return (
                <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500 text-sm">
                        No se encontraron registros.
                    </td>
                </tr>
            );
        }

        return (
            <>
            {descuentos.map((item: IDescuentoTable) => (
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
                        <Link className='btn-primary px-5 py-2 mt-3' href={ `/admin/descuentos/${ item.id }` }>
                            Modificar
                        </Link>
                    </td>                    
                </tr>
            ))}
            </>
        );
    }    
    
    return (
        <>
        <div className="flex justify-between items-center mb-5 gap-4">
            <Link className="btn-primary px-5 py-2 mt-3" href={ `/admin/descuentos/0` }>
                Nuevo
            </Link>
            <input
                type="text"
                id="numeracion"
                name="numeracion"
                placeholder="Razon Social"
                className="border px-3 py-2 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[240px]"
                value={keywordState}
                onChange={handleKeywordChange}
            />                         
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
                {isInitialLoading ? (
                    <tr>
                        <td colSpan={10} className="text-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 inline-block border-gray-900 border-b-2"></div>
                        </td>
                    </tr>
                ) : (
                    renderTable(data?.descuentos)
                )}
            </tbody>
            {totalPages > 0 && (
                <tfoot className="bg-gray-50">
                        <tr>
                            <td colSpan={10} className="px-6 py-3">
                                <div className="flex items-center justify-center space-x-2">
                                    {/* Botón Anterior */}
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => paginate(currentPage - 1)}
                                        className="px-3 py-1 rounded border disabled:opacity-30"
                                    >
                                        &lt;
                                    </button>

                                    {
                                        visiblePages.map((page, index) => (
                                            typeof page === 'number' ? (
                                                <button
                                                    key={index}
                                                    onClick={() => paginate(page)}
                                                    className={`px-3 py-1 rounded border transition-colors ${
                                                        currentPage === page 
                                                        ? 'bg-blue-600 text-white font-bold' 
                                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ) : (
                                                <span key={index} className="px-2 text-gray-500">...</span>
                                            )
                                        ))
                                    }
                                    

                                    {/* Botón Siguiente */}
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => paginate(currentPage + 1)}
                                        className="px-3 py-1 rounded border disabled:opacity-30"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
        </>
    );
}

export default DescuentosTable;