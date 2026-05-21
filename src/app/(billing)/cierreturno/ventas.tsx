'use client';
import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { currencyFormat, toLocaleShow, notify } from "@/utils";
import { obtieneCierreTurno, saveCierreTurno } from '@/actions/cierreturno';
import { logout } from "@/actions";

const ResumenTable = ({ title, headers, children, footerLabel, footerValue }: any) => {
    const numCols = headers.length;

    return (
        <table className="w-full text-lg bg-white border border-gray-300 rounded-lg border-separate mb-4 shadow-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th colSpan={numCols} className="py-2 uppercase text-sm tracking-wider border-b">
                        {title}
                    </th>
                </tr>
            </thead>
            <tbody className="text-sm text-black">
                {/* Encabezados de columna */}
                <tr className="bg-gray-50 font-bold text-gray-600">
                    {headers.map((h: string, index: number) => (
                        <td 
                            key={h} 
                            className={`p-2 border-b ${index === 0 ? 'text-left' : 'text-right'}`}
                        >
                            {h}
                        </td>
                    ))}
                </tr>

                {/* Contenido (filas) */}
                {children}

                {/* Fila de Total */}
                <tr className="font-bold bg-gray-50">
                    <td className="p-2 border-t text-left">
                        {footerLabel}
                    </td>
                    {/* Genera celdas vacías si hay más de 2 columnas para mantener la alineación */}
                    {numCols > 2 && <td className="border-t"></td>}
                    <td className="p-2 border-t text-right text-blue-700">
                        {currencyFormat(footerValue)}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export const CierreVentas = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);

    const usuarioId = session?.user?.id || "0";
    
    const { data, isLoading, error } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api/cierre/${usuarioId}`, 
        () => obtieneCierreTurno(usuarioId)
    );

    // Cálculos memorizados
    const stats = useMemo(() => {
        if (!data) return null;

        const gllProducts = data.productos.filter(p => p.medida === "GLL");
        const otherProducts = data.productos.filter(p => p.medida !== "GLL");

        const galones = gllProducts.reduce((acc, b) => ({
            solesSerafin: acc.solesSerafin + b.calibracion_soles + b.despacho_soles,
            cantSerafin: acc.cantSerafin + b.calibracion_cantidad + b.despacho_cantidad,
            solesVenta: acc.solesVenta + b.total_soles,
            cantVenta: acc.cantVenta + b.total_cantidad,
        }), { solesSerafin: 0, cantSerafin: 0, solesVenta: 0, cantVenta: 0 });

        const productosOtros = otherProducts.reduce((acc, b) => ({
            soles: acc.soles + b.total_soles,
            cant: acc.cant + b.total_cantidad
        }), { soles: 0, cant: 0 });

        const totalDepositos = data.depositos?.reduce((a, b) => a + b.monto, 0) || 0;
        const totalGastos = data.gastos?.reduce((a, b) => a + b.monto, 0) || 0;
        
        const { yape, efectivo, tarjeta } = data.soles;
        const totTipoPago = efectivo + yape + tarjeta;
        const balanceFinal = totTipoPago - (totalDepositos + totalGastos);

        return { galones, productosOtros, totalDepositos, totalGastos, totTipoPago, balanceFinal };
    }, [data]);

    const handlerProcessCierre = async () => {
        if (!data || !stats || stats.balanceFinal === 0) return;
        setIsProcessing(true);
        try{
            const { message, status } = await saveCierreTurno(session, stats.totTipoPago, data.soles, data.productos)
            if(status){          
                notify({message})
            }else{
                notify({message, type: 'error'})
            }
        }finally{
            setIsProcessing(false);
            logout();
        }

        
    };

    if (error) return <div className="p-7 text-red-500 font-bold">Error al cargar las ventas</div>;
    if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>;
    if (!data || !stats || stats.balanceFinal === 0) {
        return (
            <div className="bg-white rounded-xl shadow-xl p-7 col-span-3">
                <h2 className="text-lg font-bold">Ventas del día:</h2>
                <p className="text-gray-500">No hay ventas pendientes de cierre</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7 col-span-3">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Resumen de Cierre</h2>
            
            {/* 1. Tabla Serafin */}
            {stats.galones.solesSerafin > 0 && (
                <ResumenTable 
                    title="NOTAS DE DESPACHO / SERAFIN" 
                    headers={['PRODUCTO', 'GAL', 'IMPORTE']}
                    footerLabel="SUB TOTAL"
                    footerValue={stats.galones.solesSerafin}
                >
                    {data.productos.filter(p => p.medida === "GLL").map(item => (
                        <tr key={item.producto}>
                            <td className='text-left'>{item.producto} (Serafin/Desp)</td>
                            <td className='text-right'>{(item.despacho_cantidad + item.calibracion_cantidad).toFixed(3)}</td>
                            <td className='text-right'>{currencyFormat(item.despacho_soles + item.calibracion_soles)}</td>
                        </tr>
                    ))}
                </ResumenTable>
            )}

            {/* 2. Venta Galones */}
            <ResumenTable 
                title="VENTA GALONES" 
                headers={['PRODUCTO', 'GALONES', 'IMPORTE']}
                footerLabel="SUB TOTAL"
                footerValue={stats.galones.solesVenta}
            >
                {data.productos.filter(p => p.medida === "GLL").map(item => (
                    <tr key={item.producto}>
                        <td className='text-left'>{item.producto}</td>
                        <td className='text-right'>{item.total_cantidad.toFixed(3)}</td>
                        <td className='text-right'>{currencyFormat(item.total_soles)}</td>
                    </tr>
                ))}
            </ResumenTable>

            <ResumenTable 
                title="VENTA DE PRODUCTOS" 
                headers={['PRODUCTO', 'CANTIDAD', 'IMPORTE']}
                footerLabel="SUB TOTAL"
                footerValue={stats.productosOtros.soles}
            >
                {data.productos.filter(p => p.medida != "GLL").map(item => (
                    <tr key={item.producto}>
                        <td className='text-left'>{item.producto}</td>
                        <td className='text-right'>{item.total_cantidad.toFixed(2)}</td>
                        <td className='text-right'>{currencyFormat(item.total_soles)}</td>
                    </tr>
                ))}
            </ResumenTable>            

            {/* 3. Pagos */}
            <ResumenTable 
                title="TIPO DE PAGO" 
                headers={['MEDIO', 'MONTO']}
                footerLabel="TOTAL PAGOS"
                footerValue={stats.totTipoPago}
            >
                <tr><td className="text-left">EFECTIVO</td><td className="text-right">{currencyFormat(data.soles.efectivo)}</td></tr>
                <tr><td className="text-left">TARJETA</td><td className="text-right">{currencyFormat(data.soles.tarjeta)}</td></tr>
                <tr><td className="text-left">YAPE</td><td className="text-right">{currencyFormat(data.soles.yape)}</td></tr>
            </ResumenTable>

            {stats.totalDepositos > 0 && (
                <ResumenTable title="DEPOSITOS" headers={['FECHA HORA', 'MONTO']} footerLabel="TOTAL" footerValue={stats.totalDepositos}>
                    {data.depositos.map(d => (
                        <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                            <td>{toLocaleShow(d.fecha)}</td>
                            <td className="text-right">{currencyFormat(d.monto)}</td></tr>
                    ))}
                </ResumenTable>
            )}            
            {stats.totalGastos > 0 && (
                <ResumenTable title="GASTOS" headers={['CONCEPTO', 'MONTO']} footerLabel="TOTAL" footerValue={stats.totalGastos}>
                    {data.gastos.map(g => (
                        <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                            <td>{g.concepto}</td>
                            <td className="text-right">{currencyFormat(g.monto)}</td>
                        </tr>
                    ))}
                </ResumenTable>
            )}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg flex justify-between items-center font-bold text-xl">
                <span>EFECTIVO A ENTREGAR:</span>
                <span className="text-blue-700">{currencyFormat(stats.balanceFinal)}</span>
            </div>

            <button 
                className="btn-primary px-5 py-3 mt-4 w-full text-lg shadow-lg active:scale-95 transition-transform"
                onClick={handlerProcessCierre} disabled={isProcessing}
            >
                Imprimir y Cerrar Turno
            </button> 
        </div>
    );
};

export default CierreVentas;