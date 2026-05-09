'use client';
import useSWR from 'swr';
import { getHistoricos } from '@/actions'
import { IComprobanteHistorico } from '@/interfaces';
import Link from 'next/link';
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react';
import { toLocaleOnlyDate, toLocaleShow } from '@/utils';


interface TableProps {
  page: number;
  perPage: number;
}

const fetcher = (page: number, perPage: number, fecha: string) => getHistoricos(page, perPage, fecha);

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

export const HistoricosTable = ({ page, perPage }: TableProps) => {
    const [date, setDate] = useState<string>(toLocaleOnlyDate(new Date()));    
    const [currentPage, setCurrentPage] = useState(1);
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };    
    const { data, error, isValidating, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api`, (url: string) => fetcher(currentPage, 10, date));
    useEffect(() => {
        mutate()
    }, [currentPage, date])    
    const paginate = (pageNumber: SetStateAction<number>) => { setCurrentPage(pageNumber) };
    if(!data || isLoading || isValidating || error || !Array.isArray(data.historicos) || !Array.isArray(data.pageNumbers)){
        return (<div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>);
    }    
    const totalPages = data.pageNumbers.length;
    const visiblePages = getVisiblePages(currentPage, totalPages);    
    return (
        <>
        <div className="flex justify-between items-center mb-5">
            <input
                type="date"
                id="start"
                name="trip-start"
                value={date} 
                onChange={handleDateChange} />                        
        </div>
        <div className="mb-10 w-full overflow-x-auto">
            <table className="min-w-full">
            <thead className="bg-gray-200 border-b">
                <tr>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Fecha
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
                    Comprobante
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Total
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Isla
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Turno
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
                    PDF
                </th>
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    SUNAT
                </th> 
                <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                    Acciones
                </th>                                                                                
                </tr>
            </thead>
            <tbody>
                {data.historicos?.map((item : IComprobanteHistorico) => (
                <tr
                    key={`${item.id}-${item.numeracion_comprobante}`}
                    className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {toLocaleShow(item.fecha_hora)}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.Receptor.razon_social}
                    </td>
                    <td className="text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.numeracion_comprobante}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        {item.total}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        {item.isla}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        {item.turno}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        {item.usuario}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        {
                            item.url && item.url != 'null' &&(
                                <Link 
                                    href={item.url||"#"} 
                                    target="_blank"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    PDF
                                </Link>
                            )
                        }
                    </td>                      
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        {
                            item.errors && (
                                <Link 
                                    href={"#"} 
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    ERROR
                                </Link>
                            )
                        }
                    </td>                                        
                    <td className="text-sm text-gray-900 font-light px-6 ">
                        {/* <Link href={ `/admin/usuarios/${ item.id }` } className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Modificar
                        </Link> */}
                    </td>                    
                </tr>
                ))}

                
            </tbody>
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
            </table>
        </div>
        </>
    );
}

export default HistoricosTable;