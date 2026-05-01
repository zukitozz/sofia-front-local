"use client";
import useSWR from 'swr';
import { obtieneReporteCierrePorDiaGalones } from '@/actions'
import { currencyFormat, toLocaleOnlyDate } from "@/utils";
import { ChangeEvent, useEffect, useState } from "react";
import { IReporteCierrePorDia } from '@/interfaces';

const fetcher = (fecha: string, includeProducts: boolean) => obtieneReporteCierrePorDiaGalones(fecha, includeProducts);

export const ReporteDiario = () => {
    const [date, setDate] = useState<string>(toLocaleOnlyDate(new Date()));
    const { data, error, isValidating, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api`, (url: string) => fetcher(date, isChecked));
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };
    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };
    useEffect(() => {
        mutate();
    }, [date, isChecked])
    if(isLoading || isValidating || error || !Array.isArray(data)){
        return (<div className="flex justify-center items-center mb-7 px-10 sm:px-0"><div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div></div>);
    }
    const { sum_ventas, sum_cantidad, sum_total } = data.reduce((a,b) => {
        return ({
            sum_ventas: a.sum_ventas + b.ventas,
            sum_cantidad: a.sum_cantidad + b.cantidad,
            sum_total: a.sum_total + b.total
        })
    }, { sum_ventas: 0, sum_cantidad: 0, sum_total: 0})
    
    return (
        <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold mb-2">Reporte diario</h2>
                <label className="flex items-center gap-2">
                <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={handleOnChange} 
                />
                <span>Incluir productos</span>
                </label>               
                <input
                    type="date"
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
                            Producto
                        </th>
                        <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                            Ventas
                        </th>                
                        <th
                            scope="col"
                            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                            Volumen
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
                    {data?.map((item : IReporteCierrePorDia) => (
                    <tr
                        key={item.codigo}
                        className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.producto}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.ventas}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {item.cantidad}
                        </td>                                                    
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {currencyFormat(item.total)}
                        </td>
                    </tr>
                    ))}
                    <tr>
                        <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                            TOTAL
                        </td>
                        <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                            {sum_ventas}
                        </td>
                        <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                            {sum_cantidad.toFixed(3)}
                        </td>                                                    
                        <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                            {currencyFormat(sum_total)}
                        </td>                        
                    </tr>
                </tbody>
            </table>
        </div>        
    );
}