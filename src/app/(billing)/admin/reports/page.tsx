"use client";
import { Title } from "@/components";
import { useState } from "react";
import { ReporteDiario } from "./ReporteDiario";
import { ReporteDeclaracionMensual } from "./ReporteDeclaracionMensual";
import { ReporteCierreTurnos } from "./ReporteCierreTurnos";
import { ReporteCierreTurnosProductos } from "./ReporteCierreTurnosProductos";
import { ReporteComprobantes } from "./ReporteComprobantes";

interface IReporte {
    tipo: 'diario' | 'turnos' | 'declaracion_mensual' | 'cierres' | 'cierre_turnos' | 'cierre_turnos_productos'| 'comprobantes';
}

export default function Reports() {
    const [tipoReporte, setTipoReporte] = useState<IReporte>({ tipo: 'diario' });

    const renderSwitch = ({ tipo }: IReporte) => {
        switch (tipo) {
            case 'diario':
                return <ReporteDiario />;
            case 'declaracion_mensual':
                return <ReporteDeclaracionMensual />;
            case 'cierre_turnos':
                return <ReporteCierreTurnos />;
            case 'cierre_turnos_productos':
                return <ReporteCierreTurnosProductos />;
            case 'comprobantes':
                return <ReporteComprobantes />;                
            default:
                return null;
        }
    };

    // Función auxiliar para aplicar estilos condicionales a los botones
    const getButtonClass = (tipo: IReporte['tipo']) => {
        const baseClass = "text-left font-bold mt-2 block w-full p-2 rounded transition-colors";
        const activeClass = "bg-blue-100 text-blue-900 border-l-4 border-blue-600";
        const inactiveClass = "text-blue-800 hover:bg-gray-100";

        return `${baseClass} ${tipoReporte.tipo === tipo ? activeClass : inactiveClass}`;
    };

    return (
        <div className="flex justify-center items-center mb-7 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title title={`Reportes`} />
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4 h-fit">
                        <p className="text-gray-600 mb-4 font-semibold">Seleccione un reporte</p>
                        
                        <button 
                            className={getButtonClass('diario')} 
                            onClick={() => setTipoReporte({ tipo: 'diario' })}
                        >
                            Cierres diarios
                        </button>
                        

                        
                        <button 
                            className={getButtonClass('cierre_turnos')} 
                            onClick={() => setTipoReporte({ tipo: 'cierre_turnos' })}
                        >
                            Cierre turnos usuarios
                        </button>
                        
                        <button 
                            className={getButtonClass('cierre_turnos_productos')} 
                            onClick={() => setTipoReporte({ tipo: 'cierre_turnos_productos' })}
                        >
                            Cierre turnos productos
                        </button>
                        
                        <button 
                            className={getButtonClass('comprobantes')} 
                            onClick={() => setTipoReporte({ tipo: 'comprobantes' })}
                        >
                            Comprobantes
                        </button>
                        <button 
                            className={getButtonClass('declaracion_mensual')} 
                            onClick={() => setTipoReporte({ tipo: 'declaracion_mensual' })}
                        >
                            Declaración mensual
                        </button>                        
                    </div>
                    
                    {/* Contenedor del reporte (ocupa las 2 columnas restantes) */}
                    <div className="col-span-2">
                        {renderSwitch(tipoReporte)}
                    </div>
                </div>
            </div>
        </div>
    );
}