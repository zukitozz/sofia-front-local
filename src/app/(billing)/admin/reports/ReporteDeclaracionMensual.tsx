"use client";
import useSWR from 'swr';
import { obtieneReporteDeclaracionMensual } from '@/actions'
import { toLocaleOnlyDate } from "@/utils";
import { ChangeEvent, useState, useMemo } from "react";
import { IReporteDeclaracionMensual } from '@/interfaces';
import * as XLSX from 'xlsx';
import { IoDownloadOutline, IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const fetcher = (fecha: string) => obtieneReporteDeclaracionMensual(fecha);

export const ReporteDeclaracionMensual = () => {
    const [date, setDate] = useState<string>(toLocaleOnlyDate(new Date()));
    
    // --- ESTADOS DE PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Puedes cambiar esto a 20 o 50

    const { data, error, isValidating, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_URL}/api-${date}`, 
        () => fetcher(date)
    );

    // --- LÓGICA DE PAGINACIÓN ---
    // Usamos useMemo para no recalcular en cada render a menos que data o la página cambien
    const { paginatedData, totalPages } = useMemo(() => {
        if (!Array.isArray(data)) return { paginatedData: [], totalPages: 0 };
        
        const total = Math.ceil(data.length / itemsPerPage);
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        return {
            paginatedData: data.slice(start, end),
            totalPages: total
        };
    }, [data, currentPage]);

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
        setCurrentPage(1); // Reiniciar a la página 1 si cambia la fecha
    };

    const exportToExcel = () => {
        if (!data || data.length === 0) return;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Completo");
        XLSX.writeFile(workbook, `Reporte_Mensual_${date}.xlsx`);
    };

    if (isLoading || isValidating) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-gray-900 border-b-2"></div>
            </div>
        );
    }

    return (
        <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-lg font-semibold text-gray-800">Reporte declaración mensual</h2>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={exportToExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition-all text-sm shadow-sm"
                    >
                        <IoDownloadOutline size={18} />
                        Excel
                    </button>
                    <input
                        className="border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        type="month"
                        value={date}
                        onChange={handleDateChange} 
                    />
                </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Numeración</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        {paginatedData.map((item: IReporteDeclaracionMensual, index) => (
                            <tr key={`${item.numeracion_comprobante}-${index}`} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.numeracion_comprobante}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{toLocaleOnlyDate(item.fecha_emision)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.hora}</td>
                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{item.total_venta}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- CONTROLES DE PAGINACIÓN --- */}
            <div className="flex items-center justify-between mt-4 px-2">
                <span className="text-sm text-gray-700">
                    Mostrando <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> a <span className="font-semibold">{Math.min(currentPage * itemsPerPage, data?.length || 0)}</span> de <span className="font-semibold">{data?.length}</span> registros
                </span>
                
                <div className="inline-flex gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <IoChevronBackOutline size={20} />
                    </button>
                    
                    <div className="flex items-center px-4 border rounded bg-gray-50 text-sm font-medium">
                        Página {currentPage} de {totalPages}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <IoChevronForwardOutline size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}