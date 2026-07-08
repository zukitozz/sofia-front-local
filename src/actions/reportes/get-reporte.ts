"use server";
import { executeQuery } from '@/utils/db';
import { IReporteCierrePorDia, IReporteCierreTurno, IReporteCierreTurnoProductos, IReporteComprobantes, IReporteDeclaracionMensual } from "@/interfaces";

export async function obtieneReporteCierrePorDiaGalones(fecha: string, includeProducts: boolean): Promise<IReporteCierrePorDia[]> { 
    const date: Date = new Date(fecha);
    date.setDate(date.getDate() + Number.parseInt(process.env.NEXT_PUBLIC_CIERRE_DIA || "0"));
    const nextDayString: string = date.toISOString().split('T')[0];    
    const query =     `
            select ctd.codigo,ctd.producto,
            SUM(ctd.total_cantidad) + SUM(ctd.calibracion_cantidad) + SUM(ctd.despacho_cantidad) as cantidad,
            SUM(ctd.total_soles) + SUM(ctd.calibracion_soles) + SUM(ctd.despacho_soles) as total
            from Cierreturnos t 
            inner join Cierredias d on t.CierrediaId = d.id 
            inner join Cierreturnosdetalle ctd on t.id = ctd.CierreturnoId 
            where CAST(d.fecha AS DATE) = '${nextDayString}' ${includeProducts?"":"and ctd.medida = 'GLL' "}
            group by ctd.codigo, ctd.producto
        `;
    const cierres = await executeQuery<IReporteCierrePorDia[]>(
        process.env.DB_DATABASE_AUXILIAR||"", query
    );    
    return cierres;
}

export async function obtieneReporteDeclaracionMensual(fecha: string): Promise<IReporteDeclaracionMensual[]> { 
    const split_fecha = fecha.split("-");
    const cierres = await executeQuery<IReporteDeclaracionMensual[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `
            select c.tipo_comprobante, r.tipo_documento, r.numero_documento, c.numeracion_comprobante, c.tipo_documento_afectado, c.numeracion_documento_afectado, c.fecha_emision, LEFT(convert(varchar,c.fecha_hora,108), 8) as hora, CAST(c.total_gravadas as decimal(10,2)) as total_gravadas, CAST(c.total_igv as decimal(10,2)) as total_igv, CAST(c.total_venta as decimal(10,2)) as total_venta, c.dec_combustible, c.volumen, c.pistola, c.tiempo_abastecimiento, c.ruc 
            from Comprobantes c 
            inner join Receptores r on c.ReceptorId = r.id 
            where YEAR(fecha_emision) = '${split_fecha[0]}' and MONTH(fecha_emision) = '${split_fecha[1]}' and tipo_comprobante in ('01','03','07') and ISNULL(c.errors, '') = '' 
            order by c.id desc;
        `
    );    
    return cierres;
}

export async function obtieneReporteCierrePorDia(fecha: string): Promise<IReporteCierreTurno[]> { 
    const date: Date = new Date(fecha);
    date.setDate(date.getDate() + Number.parseInt(process.env.NEXT_PUBLIC_CIERRE_DIA || "0"));
    const nextDayString: string = date.toISOString().split('T')[0];
    const query =     `
        select t.turno, t.fecha, u.nombre,t.efectivo, t.tarjeta, t.yape, t.total
        from Cierreturnos t 
        inner join Cierredias di on di.id=t.CierrediaId 
        inner join Usuarios u on t.UsuarioId = u.id 
        where CAST(di.fecha AS DATE) = '${nextDayString}' order by t.fecha asc
        `;
    const cierres = await executeQuery<IReporteCierreTurno[]>(
        process.env.DB_DATABASE_AUXILIAR||"", query
    );    
    return cierres;
}

export async function obtieneReporteCierreTurnosProductosPorDia(fecha: string, includeProducts: boolean): Promise<IReporteCierreTurnoProductos[]> { 
    const date: Date = new Date(fecha);
    date.setDate(date.getDate() + Number.parseInt(process.env.NEXT_PUBLIC_CIERRE_DIA || "0"));
    const nextDayString: string = date.toISOString().split('T')[0];    
    const query =     `
        select t.turno, d.producto, sum(d.total_cantidad) as total_cantidad, sum(d.total_soles) as total_soles, sum(despacho_cantidad) as despacho_cantidad, sum(despacho_soles) as despacho_soles, sum(calibracion_cantidad) as calibracion_cantidad, sum(calibracion_soles) as calibracion_soles
        from Cierreturnos t 
        inner join Cierredias di on di.id=t.CierrediaId 
        inner join Cierreturnosdetalle d on t.id = d.CierreturnoId 
        where CAST(di.fecha AS DATE) = '${nextDayString}' ${includeProducts?"":"and d.medida = 'GLL' "}
        group by d.producto, t.turno 
        `;
    const cierres = await executeQuery<IReporteCierreTurnoProductos[]>(
        process.env.DB_DATABASE_AUXILIAR||"", query
    );    
    return cierres;
}
interface IParametrosReporteComprobantes {
    boletas: boolean;
    factura: boolean;
    notasCredito: boolean;
    notasDespacho: boolean;
    calibracion: boolean;
    fechaInicio: string;
    fechaFin: string;
    usuario: string;
    ruc: string;
}
export async function obtieneReporteComprobantes({ boletas, factura, notasCredito, notasDespacho, calibracion, fechaInicio, fechaFin, usuario, ruc }: IParametrosReporteComprobantes): Promise<IReporteComprobantes[]> { 
    let conditions = '';
    let where = 'where 1=1';
    if(fechaInicio) where += ` and c.fecha_emision >= '${fechaInicio}'`;
    if(fechaFin) where += ` and c.fecha_emision <= '${fechaFin}'`;
    if(usuario) where += ` and c.UsuarioId = '${usuario}'`;
    if(ruc) where += ` and r.numero_documento = '${ruc}'`;
    if(boletas || factura || notasCredito || notasDespacho || calibracion){
        if(boletas) conditions += `c.tipo_comprobante = '03' OR `;
        if(factura) conditions += `c.tipo_comprobante = '01' OR `;
        if(notasCredito) conditions += `c.tipo_comprobante = '07' OR `;
        if(notasDespacho) conditions += `c.tipo_comprobante = '50' OR `;
        if(calibracion) conditions += `c.tipo_comprobante = '51' OR `;
        where += ` and (${conditions.slice(0, -4)})`; // Eliminar el último " OR "
    } else {
        where += ` and 1=0`;
    }
    const query = `
        select TOP 100 c.id as id, numeracion_comprobante as comprobante, c.fecha_hora as fecha, fecha_abastecimiento as fechahora, r.numero_documento, r.razon_social as receptor, c.placa, c.dec_combustible, c.total  as total, u.nombre as usuario, c.url  
        from Comprobantes c  
        inner join Receptores r on c.ReceptorId = r.id 
        inner join Usuarios u on c.UsuarioId = u.id
        ${where} order by c.id desc
        `;
    const comprobantes = await executeQuery<IReporteComprobantes[]>(
        process.env.DB_DATABASE_AUXILIAR||"", query
    );    
    return comprobantes;
}