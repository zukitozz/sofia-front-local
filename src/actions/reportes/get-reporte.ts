"use server";
import { executeQuery } from '@/utils/db';
import { IReporteCierrePorDia, IReporteCierreTurno, IReporteDeclaracionMensual } from "@/interfaces";

export async function obtieneReporteCierrePorDiaGalones(fecha: string, includeProducts: boolean): Promise<IReporteCierrePorDia[]> { 
    const query =     `
            select ctd.codigo,ctd.producto,
            SUM(ctd.total_cantidad) + SUM(ctd.calibracion_cantidad) + SUM(ctd.despacho_cantidad) as cantidad,
            SUM(ctd.total_soles) + SUM(ctd.calibracion_soles) + SUM(ctd.despacho_soles) as total
            from Cierreturnos t 
            inner join Cierredias d on t.CierrediaId = d.id 
            inner join Cierreturnosdetalle ctd on t.id = ctd.CierreturnoId 
            where CAST(d.fecha AS DATE) = '${fecha}' ${includeProducts?"":"and ctd.medida = 'GLL' "}
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
            where YEAR(fecha_emision) = '${split_fecha[0]}' and MONTH(fecha_emision) = '${split_fecha[1]}' and tipo_comprobante in ('01','03','07') and c.errors = ' '
            order by c.id desc;
        `
    );    
    return cierres;
}

export async function obtieneReporteCierrePorDia(fecha: string): Promise<IReporteCierreTurno[]> { 
    const query =     `
        select t.turno, t.fecha, u.nombre,t.efectivo, t.tarjeta, t.yape, t.total
        from Cierreturnos t 
        inner join Cierredias di on di.id=t.CierrediaId 
        inner join Usuarios u on t.UsuarioId = u.id 
        where CAST(di.fecha AS DATE) = '${fecha}' order by t.fecha asc
        `;
    const cierres = await executeQuery<IReporteCierreTurno[]>(
        process.env.DB_DATABASE_AUXILIAR||"", query
    );    
    return cierres;
}