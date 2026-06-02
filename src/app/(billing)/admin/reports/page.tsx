"use client";
import { Title } from "@/components";
import Link from "next/link";
import { useState } from "react";
import { ReporteDiario } from "./ReporteDiario";
import { ReporteDeclaracionMensual } from "./ReporteDeclaracionMensual";
import { ReporteCierreTurnos } from "./ReporteCierreTurnos";
import { ReporteCierreTurnosProductos } from "./ReporteCierreTurnosProductos";

interface IReporte {
    tipo: 'diario'|'turnos'|'declaracion_mensual'|'cierres'|'cierre_turnos'|'cierre_turnos_productos';
}

export default function Reports() {
    const [tipoReporte, setTipoReporte] = useState<IReporte>({tipo: 'diario'});

    const renderSwitch = ({ tipo }: IReporte) => {
        switch(tipo) {
            case 'diario':
                return <>
                    <ReporteDiario/>
                </>
            case 'declaracion_mensual':
                return <>
                    <ReporteDeclaracionMensual/>
                </>
            case 'cierre_turnos':
                return <>
                    <ReporteCierreTurnos/>
                </>
            case 'cierre_turnos_productos':
                return <>
                    <ReporteCierreTurnosProductos/>
                </>                                 
        }
    }
    return (
        <div className="flex justify-center items-center mb-7 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title title={`Reportes`} />  
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100">
                        <p className="text-gray-600">Seleccione un reporte.</p>
                        <Link href={ `#` } className="text-blue-800 font-bold mt-2 inline-block" onClick={() => setTipoReporte({tipo: 'diario'})}>
                            Reporte diario
                        </Link>
                        <Link href={  `#` } className="text-blue-800 font-bold mt-2 inline-block" onClick={() => setTipoReporte({tipo: 'declaracion_mensual'})}>
                            Reporte declaración mensual
                        </Link>
                        <Link href={  `#` } className="text-blue-800 font-bold mt-2 inline-block" onClick={() => setTipoReporte({tipo: 'cierre_turnos'})}>
                            Reporte cierre de turnos
                        </Link>
                        <Link href={  `#` } className="text-blue-800 font-bold mt-2 inline-block" onClick={() => setTipoReporte({tipo: 'cierre_turnos_productos'})}>
                            Reporte cierre de turnos y productos
                        </Link>                        
                    </div>
                    {
                        renderSwitch(tipoReporte)
                    }
                </div>
            </div>
        </div>
    );
}