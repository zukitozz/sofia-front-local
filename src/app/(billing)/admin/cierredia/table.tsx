'use client';
import useSWR from 'swr';

import { obtieneCierreDia, saveCierreDia } from '@/actions'
import { ICierreTurno, ICierreTurnoDetalle } from '@/interfaces';
import { currencyFormat, toLocaleStorage } from '@/utils';

interface TableProps {
  page: number;
  perPage: number;
  keyword?: string;
}

const fetcher = (page: number, perPage: number, keyword?: string) => obtieneCierreDia();
//TODO Cierre turno agregar turno e isla
export const CierreSection = ({ page, perPage, keyword }: TableProps) => {
    const { data, error, isLoading, isValidating } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api`, (url: string) => fetcher(page, perPage, keyword));
    if(!data || isLoading || isValidating || error || !Array.isArray(data)){
        return (<div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>);
    }
    const { total } = data.reduce((a,b)=>{
        return({
            total: a.total + b.total
        })
    }, { total: 0 });

    const handlerProcessCierre = async () => {      
        await saveCierreDia(total);
    }  

    return(
        <>
        <div className="gap-10">
            <button className={`${false ? "btn-disabled" : "btn-primary"} px-5 py-2 mt-3 mb-3`} disabled={false} onClick={() =>handlerProcessCierre()}>
                    Cerrar dia
            </button>       
        </div> 
        <div className="grid grid-cols-6 sm:grid-cols-6 gap-10">
            {
                data.map((cierre : ICierreTurno) => (
                    <div key={ cierre.id } className="bg-white rounded-xl shadow-xl p-7 col-span-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div><b>FECHA:</b> { cierre.fecha? toLocaleStorage(cierre.fecha):'' } </div>
                            <div><b>TURNO:</b> { cierre.turno } </div>
                            <div><b>USUARIO:</b> { cierre.usuario?.nombre } </div>
                            <div><b>ISLA:</b> { cierre.isla } </div>
                        </div>
                        {
                            (cierre.detalle ?? []).filter((producto) => producto.medida == "GLL" && producto.calibracion_cantidad > 0).length > 0 && (
                                <>
                                    <hr/>
                                    <h3 className="mt-5 mb-2"><b>CALIBRACION:</b></h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>SERAFIN</div>
                                        <div>GAL</div>
                                        <div>IMPORTE</div>                            
                                    </div>
                                    {
                                        cierre.detalle?.filter((producto) => producto.medida == "GLL" && producto.calibracion_cantidad > 0).map((item: ICierreTurnoDetalle) => (
                                            <div key={item.producto}>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div>{ item.producto}</div>
                                                    <div>{ item.calibracion_cantidad }</div>
                                                    <div>{ currencyFormat(item.calibracion_soles) }</div>
                                                </div>
                                            </div>
                                        ))
                                    }                                    
                                </>
                            )
                        }
                        {
                            (cierre.detalle ?? []).filter((producto) => producto.medida == "GLL" && producto.despacho_cantidad > 0).length > 0 && (
                                <>
                                    <hr/>
                                    <h3 className="mt-5 mb-2"><b>NOTAS DESPACHO:</b></h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>NOTAS DESPACHO</div>
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
                                    <h3 className="mt-5 mb-2"><b>PRODUCTOS:</b></h3>
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
                        {/* <h3>&nbsp;<b>TOTAL:</b> { cierre.total }&nbsp;</h3>
                        <h2><b>EFECT: </b>{ currencyFormat(cierre.efectivo) }&nbsp;<b>TARJ:</b> { currencyFormat(cierre.tarjeta) }&nbsp;<b>YAPE:</b> { currencyFormat(cierre.yape) }</h2> */}
                    </div>  
                ))
            }

        </div>
        </>
    )
}

export default CierreSection;