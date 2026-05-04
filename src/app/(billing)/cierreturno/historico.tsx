'use client';
import useSWR from 'swr';

import { obtieneHistoricoCierres } from '@/actions/cierreturno'
import { useSession } from "next-auth/react";
import { ICierreTurno, ICierreTurnoDetalle } from '@/interfaces/cierreturno.interface';
import { currencyFormat, toLocaleShow } from '@/utils/formats';

const fetcher = (usuarioId: string) => obtieneHistoricoCierres(usuarioId);

export const Historico = () => {
    const { data: session } = useSession();
    const usuarioId = session?.user?.id ? session.user.id : "";
    const { data, error, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api`, () => fetcher(usuarioId));

    if(!data || isLoading || isValidating || error || !Array.isArray(data)){
        return (<div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>);
    }
    
    return (
        <div className="bg-white rounded-xl shadow-xl p-7 col-span-3">
        <h2 className="text-lg font-semibold mb-2">Histórico (Últimos 2)</h2>
                {
                    data.map((cierre : ICierreTurno) => (
                        <div key={ cierre.id } className="bg-white rounded-xl shadow-xl p-7 col-span-3 mb-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div><b>TURNO:</b> { cierre.turno } </div>
                                <div><b>ISLA:</b> { cierre.isla } </div>
                                <div className="col-span-2"><b>FECHA:</b> { toLocaleShow(cierre.fecha) } </div>                                
                            </div>
                            {
                                (cierre.detalle ?? []).filter((producto) => producto.medida == "GLL" && producto.calibracion_cantidad > 0).length > 0 && (
                                    <>
                                        <hr/>
                                        <h3 className="mt-5 mb-2"><b>NOTAS DE DESPACHO</b></h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>SERAFIN</div>
                                            <div>GAL</div>
                                            <div>IMPORTE</div>                            
                                        </div>
                                        {
                                            cierre.detalle?.filter((producto) => producto.medida == "GLL" && producto.despacho_cantidad > 0).map((item: ICierreTurnoDetalle) => (
                                                <div key={item.producto}>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>{ item.producto}</div>
                                                        <div>{ item.despacho_cantidad }</div>
                                                        <div>{ currencyFormat(item.despacho_soles) }</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </>
                                )
                            }
                            {
                                (cierre.detalle ?? []).filter((producto) => producto.medida == "GLL" && producto.total_cantidad > 0).length > 0 && (
                                    <>
                                        <hr/>
                                        <h3 className="mt-5 mb-2"><b>VENTA GALONES/CANTIDAD</b></h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>PRODUCTO</div>
                                            <div>GAL</div>
                                            <div>IMPORTE</div>                            
                                        </div>
                                        {
                                            cierre.detalle?.filter((producto) => producto.medida == "GLL" && producto.total_cantidad > 0).map((item: ICierreTurnoDetalle) => (
                                                <div key={item.producto}>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>{ item.producto}</div>
                                                        <div>{ item.total_cantidad }</div>
                                                        <div>{ currencyFormat(item.total_soles) }</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </>
                                )
                            }
                            {
                                (cierre.detalle ?? []).filter((producto) => producto.medida != "GLL" && producto.total_cantidad > 0).length > 0 && (
                                    <>
                                        <hr/>
                                        <h3 className="mt-5 mb-2"><b>VENTA POR PRODUCTO</b></h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div>PRODUCTO</div>
                                            <div>CANT</div>
                                            <div>IMPORTE</div>                            
                                        </div>
                                        {
                                            cierre.detalle?.filter((producto) => producto.medida != "GLL"&& producto.total_cantidad > 0).map((item: ICierreTurnoDetalle) => (
                                                <div key={item.producto}>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>{ item.producto}</div>
                                                        <div>{ item.total_cantidad }</div>
                                                        <div>{ currencyFormat(item.total_soles) }</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </>
                                )
                            }                             
                        </div>
                    ))
                }
        </div>        
    )
}