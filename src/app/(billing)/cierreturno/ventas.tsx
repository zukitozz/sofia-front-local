'use client';
import useSWR from 'swr';
import { ICierreTurnoDetalle, ICierreTurnoSoles, IDepositos, IGastos } from "@/interfaces";
import { currencyFormat, toLocaleShow } from "@/utils";
import { saveCierreTurno, obtieneCierreTurno } from '@/actions/cierreturno'
import { useSession } from "next-auth/react";

interface Props {
    productos: ICierreTurnoDetalle[];
    soles: ICierreTurnoSoles;
    depositos: IDepositos[];
    gastos: IGastos[];
}

const fetcher = (usuarioId: string) => obtieneCierreTurno(usuarioId);

export const CierreVentas = () => {
    const { data: session } = useSession();
    const usuarioId = session?.user?.id ? session.user.id : "0";
    const { data, isLoading, error} = useSWR<Props>(`${process.env.NEXT_PUBLIC_URL}/api/hola`, () => fetcher(usuarioId));
    
    if (error) {
        return <div>Error al cargar las ventas</div>;
    }    
    if(!data || isLoading){
        return (<div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>);
    } 
    if(data){
        const { productos, soles, depositos, gastos } = data;
        const { 
            tot_notas_serafin_soles, 
            tot_notas_serafin_galones, 
            tot_venta_soles, 
            tot_venta_galones 
        } = productos.filter((producto) => producto.medida == "GLL").reduce((a, b) => {
            return ({
                tot_notas_serafin_soles: a.tot_notas_serafin_soles + b.calibracion_soles + b.despacho_soles,
                tot_notas_serafin_galones: a.tot_notas_serafin_galones + b.calibracion_cantidad + b.despacho_cantidad,
                tot_venta_soles: a.tot_venta_soles + b.total_soles,
                tot_venta_galones: a.tot_venta_galones + b.total_cantidad,
            })
        }, { tot_notas_serafin_soles: 0, tot_notas_serafin_galones: 0, tot_venta_soles: 0, tot_venta_galones: 0 })            
        const { tot_producto_soles, tot_producto_cantidad } = productos?productos.filter((producto) => producto.medida != "GLL").reduce((a,b)=>{
            return({
                tot_producto_soles: a.tot_producto_soles + b.total_soles,
                tot_producto_cantidad: a.tot_producto_cantidad + b.total_cantidad
            })
        }, { tot_producto_soles: 0, tot_producto_cantidad: 0 }):{ tot_producto_soles: 0, tot_producto_cantidad: 0 }            
        const { tot_depositos } = depositos?depositos.reduce((a,b)=>{
            return({
                tot_depositos: a.tot_depositos + b.monto
            })
        }, { tot_depositos: 0 }):{ tot_depositos: 0 }
        const { tot_gastos } = gastos?gastos.reduce((a,b)=>{
            return({
                tot_gastos: a.tot_gastos + b.monto
            })
        }, { tot_gastos: 0 }):{ tot_gastos: 0 }          

        const { yape, efectivo, tarjeta } = soles;
        const tot_tipo_pago = efectivo + yape + tarjeta
        const total = tot_tipo_pago - ( tot_depositos + tot_gastos );

        const handlerProcessCierre = async () => {
            await saveCierreTurno(session, total, soles, productos)
        }

        if (total == 0) {
                return (
                    <div className="bg-white rounded-xl shadow-xl p-7 col-span-3">
                        <h2>Ventas del día:</h2>
                        <p>No hay ventas pendientes de cierre</p>
                    </div>
                )

        }

        return (
            <div className="bg-white rounded-xl shadow-xl p-7 col-span-3">
                <h2 className="text-lg font-semibold mb-2">Ventas del día</h2>
                <div>
                    {
                        /* Notas de despacho serafin */
                        tot_notas_serafin_soles != 0 && (
                            <table className="w-full text-lg text-center rtl:text-right text-dark-100 dark:text-blue-100 bg-white-100 border border-gray-300 rounded-lg border-separate mb-3">
                                <thead>
                                    <tr>
                                        <th scope="col" colSpan={4}>NOTAS DE DESPACHO/SERAFIN</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-black dark:text-white border-4 border-gray-300">
                                    <tr>
                                        <td className='text-left font-bold'>NOTAS DE DESPACHO</td>
                                        <td className='text-right font-bold'>GAL</td>
                                        <td className='text-right font-bold'>IMPORTE</td>
                                    </tr>
                                {!isLoading && (
                                    data?.productos.filter((producto) => producto.medida == "GLL").map( item => (
                                        <tr key={item.producto}>
                                            <td className='text-left'>{ item.producto}</td>
                                            <td className='text-right'>{ item.despacho_cantidad.toFixed(3) }</td>
                                            <td className='text-right'>{ currencyFormat(item.despacho_soles) }</td>
                                        </tr>
                                    ))
                                )}
                                <tr>
                                        <td className='text-left font-bold'>SERAFIN</td>
                                        <td className='text-right font-bold'>GAL</td>
                                        <td className='text-right font-bold'>IMPORTE</td>
                                    </tr>
                                {!isLoading && (
                                    data?.productos.filter((producto) => producto.medida == "GLL").map( item => (
                                        <tr key={item.producto}>
                                            <td className='text-left'>{ item.producto}</td>
                                            <td className='text-right'>{ item.calibracion_cantidad.toFixed(3) }</td>
                                            <td className='text-right'>{ currencyFormat(item.calibracion_soles) }</td>
                                        </tr>
                                    ))
                                )}                                    
                                    <tr>
                                        <td className='text-left font-bold'>SUB TOTAL</td>
                                        <td className='text-right font-bold'>{ tot_notas_serafin_galones.toFixed(3) }</td>
                                        <td className='text-right font-bold'>{ currencyFormat(tot_notas_serafin_soles) }</td>
                                    </tr>
                                </tbody>
                            </table>                                           
                        )
                    }
                    {
                        /* Venta de galones cantidad */
                        tot_venta_soles !== 0 && (
                            <table className="w-full text-lg text-center rtl:text-right text-dark-100 dark:text-blue-100 bg-white-100 border border-gray-300 rounded-lg border-separate mb-3">
                                <thead>
                                    <tr>
                                        <th scope="col" colSpan={4}>VENTA GALONES/CANTIDAD</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-black dark:text-white border-4 border-gray-300">
                                    <tr>
                                        <td className='text-left font-bold'>PRODUCTO</td>
                                        <td className='text-right font-bold'>GAL</td>
                                        <td className='text-right font-bold'>IMPORTE</td>
                                    </tr>
                                    {
                                    data?.productos.filter((producto) => producto.medida == "GLL").map( item => (
                                        <tr key={item.producto}>
                                            <td className='text-left'>{ item.producto}</td>
                                            <td className='text-right'>{ item.total_cantidad.toFixed(3) }</td>
                                            <td className='text-right'>{ currencyFormat(item.total_soles) }</td>
                                        </tr>
                                    ))
                                    }
                                    <tr>
                                        <td className='text-left font-bold'>SUB TOTAL</td>
                                        <td className='text-right font-bold'>{ tot_venta_galones.toFixed(3) }</td>
                                        <td className='text-right font-bold'>{ currencyFormat(tot_venta_soles) }</td>
                                    </tr>                                    
                                </tbody>
                            </table>
                        )
                    }
                    {
                        /* Venta por producto */
                        tot_producto_soles !==0 && (
                            <table className="w-full text-lg text-center rtl:text-right text-dark-100 dark:text-blue-100 bg-white-100 border border-gray-300 rounded-lg border-separate mb-3">
                                <thead>
                                    <tr>
                                        <th scope="col" colSpan={4}>VENTA POR PRODUCTO</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-black dark:text-white border-4 border-gray-300">
                                    <tr>
                                        <td className='text-left font-bold'>PRODUCTO</td>
                                        <td className='text-right font-bold'>CANT</td>
                                        <td className='text-right font-bold'>SOLES</td>
                                    </tr>
                                    {
                                    data?.productos.filter((producto) => producto.medida != "GLL").map( item => (
                                        <tr key={item.producto}>
                                            <td className='text-left'>{ item.producto}</td>
                                            <td className='text-right'>{ item.total_cantidad.toFixed(2) }</td>
                                            <td className='text-right'>{ currencyFormat(item.total_soles) }</td>
                                        </tr>
                                    ))
                                    }
                                    <tr>
                                        <td className='text-left font-bold'>SUB TOTAL</td>
                                        <td className='text-right font-bold'>{ tot_producto_cantidad.toFixed(2) }</td>
                                        <td className='text-right font-bold'>{ currencyFormat(tot_producto_soles) }</td>
                                    </tr>
                                </tbody>
                            </table>
                        )
                    }
                    {
                        /* Venta por tipo de pago */
                        tot_tipo_pago !== 0 && (
                            <table className="w-full text-lg text-center rtl:text-right text-dark-100 dark:text-blue-100 bg-white-100 border border-gray-300 rounded-lg border-separate mb-3">
                                <thead>
                                    <tr>
                                        <th scope="col" colSpan={4}>VENTA POR TIPO DE PAGO</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-black dark:text-white border-4 border-gray-300">
                                    <tr>
                                        <td className='text-left font-bold'>TIPO</td>
                                        <td className='text-right font-bold'>MONTO</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left'>EFECTIVO</td>
                                        <td className='text-right'>{ currencyFormat(efectivo) }</td>             
                                    </tr>
                                    <tr>
                                        <td className='text-left'>TARJETA</td>
                                        <td className='text-right'>{ currencyFormat(tarjeta) }</td>             
                                    </tr>
                                    <tr>
                                        <td className='text-left'>YAPE</td>
                                        <td className='text-right'>{ currencyFormat(yape) }</td>             
                                    </tr>
                                    <tr>
                                        <td className='text-left font-bold'>SUB TOTAL</td>
                                        <td className='text-right font-bold'>{ currencyFormat(tot_tipo_pago) }</td>
                                    </tr>                                            
                                </tbody>
                            </table>
                        )
                    }

                    {
                        /* Depositos parciales*/
                        tot_depositos !== 0 && (
                            <table className="w-full text-lg text-center rtl:text-right text-dark-100 dark:text-blue-100 bg-white-100 border border-gray-300 rounded-lg border-separate mb-3">
                                <thead>
                                    <tr>
                                        <th scope="col" colSpan={4}>DEPOSITOS PARCIALES</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-black dark:text-white border-4 border-gray-300">
                                    <tr>
                                        <td className='text-left font-bold'>FECHA HORA</td>
                                        <td className='text-right font-bold'>TOTAL</td>
                                    </tr>
                                {
                                    data?.depositos.map( deposito => (
                                        <tr key={deposito.id}>
                                            <td className='text-left'>{ toLocaleShow(deposito.fecha)}</td>
                                            <td className='text-right'>{ currencyFormat(deposito.monto) }</td>
                                        </tr>
                                    ))
                                }
                                    <tr>
                                        <td className='text-left font-bold'>SUB TOTAL</td>
                                        <td className='text-right font-bold'>{ currencyFormat(tot_depositos) }</td>
                                    </tr>  
                                </tbody>
                            </table>
                        )
                    }
                    {
                        /* Gastos */
                        tot_gastos !== 0 && (
                            <table className="w-full text-lg text-center rtl:text-right text-dark-100 dark:text-blue-100 bg-white-100 border border-gray-300 rounded-lg border-separate mb-3">
                                <thead>
                                    <tr>
                                        <th scope="col" colSpan={4}>GASTOS</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-black dark:text-white border-4 border-gray-300">
                                    <tr>
                                        <td className='text-left font-bold'>FECHA HORA</td>
                                        <td className='text-right font-bold'>MONTO</td>
                                    </tr>
                                {
                                    data?.gastos.map( gasto => (
                                        <tr key={gasto.id}>
                                            <td className='text-left'>{ gasto.concepto}</td>
                                            <td className='text-right'>{ currencyFormat(gasto.monto) }</td>
                                        </tr>
                                    ))
                                }
                                    <tr>
                                        <td className='text-left font-bold'>SUB TOTAL</td>
                                        <td className='text-right font-bold'>{ currencyFormat(tot_gastos) }</td>
                                    </tr>                                      
                                </tbody>
                            </table>
                        )
                    }
                </div>
                <button className={`${false ? "btn-disabled" : "btn-primary"} px-5 py-2 mt-3 w-full`} disabled={false} onClick={() =>handlerProcessCierre()}>
                        Cerrar turno
                </button> 
            </div>           

        );
        
    }
}


export default CierreVentas;