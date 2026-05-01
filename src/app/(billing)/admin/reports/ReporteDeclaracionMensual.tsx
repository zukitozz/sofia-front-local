"use client";
import useSWR from 'swr';
import { obtieneReporteDeclaracionMensual } from '@/actions'
import { toLocaleOnlyDate, toLocaleShow } from "@/utils";
import { ChangeEvent, useEffect, useState } from "react";
import { IReporteDeclaracionMensual } from '@/interfaces';

const fetcher = (fecha: string) => obtieneReporteDeclaracionMensual(fecha);

export const ReporteDeclaracionMensual = () => {
    const [date, setDate] = useState<string>(toLocaleOnlyDate(new Date())); // Default to today's date in 'YYYY-MM-DD' format
    const { data, error, isValidating, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api`, (url: string) => fetcher(date));
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };
    useEffect(() => {
        mutate();
        console.log(date)
    }, [date])
    if(isLoading || isValidating || error || !Array.isArray(data)){
        return (<div className="flex justify-center items-center mb-7 px-10 sm:px-0"><div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div></div>);
    }
    
    return (
        <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold mb-2">Reporte declaración mensual</h2>
                <input
                    type="month"
                    id="start"
                    name="trip-start"
                    value={date} 
                    onChange={handleDateChange} />
            </div>
            <table className="min-w-full">
                <thead className="bg-gray-200 border-b">
                    <tr>
                        <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                            Numeracion
                        </th>
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
                            Hora
                        </th>
                        <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                            Total
                        </th>                                                                        
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item : IReporteDeclaracionMensual) => (
                    <tr
                        key={item.numeracion_comprobante + item.numeracion_comprobante}
                        className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.numeracion_comprobante}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {toLocaleShow(item.fecha_emision)}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.hora}
                        </td>                                                    
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.total_venta}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>        
    );
}