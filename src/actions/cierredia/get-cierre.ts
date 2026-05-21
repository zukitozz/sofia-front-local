"use server";
import { executeQuery } from '@/utils/db';
import { ICierreTurno, ICierreTurnoDetalle, IDepositos, IGastos, IUser } from "@/interfaces";

export async function obtieneCierreDia(): Promise<ICierreTurno[]> {
    const cierres = await executeQuery<ICierreTurno[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `
            select id, total, fecha, turno, isla, efectivo, tarjeta, yape, UsuarioId  
            from Cierreturnos 
            where CierrediaId is null;
        `
    );
    await Promise.all(
        cierres.map(async cierre => {
            const detalle = await executeQuery<ICierreTurnoDetalle[]>(
                process.env.DB_DATABASE_AUXILIAR||"", 
                `
                    select codigo, producto, medida, total_cantidad, total_soles, calibracion_cantidad, calibracion_soles, despacho_cantidad, despacho_soles 
                    from Cierreturnosdetalle 
                    where CierreturnoId = ${cierre.id};
                `
            );
            cierre.detalle = detalle;
            const usuario = await executeQuery<IUser[]>(
                process.env.DB_DATABASE_AUXILIAR||"", 
                `
                    select id, nombre, usuario, correo from Usuarios where id = ${cierre.UsuarioId};
                `
            );
            cierre.usuario = usuario[0];
            const depositos = await executeQuery<IDepositos[]>(
                process.env.DB_DATABASE_AUXILIAR||"", 
                `
                    select id, concepto, monto, usuario, turno, fecha, UsuarioId 
                    from Depositos 
                    where CierreturnoId = ${cierre.id};
                `
            );
            cierre.depositos = depositos;
            const gastos = await executeQuery<IGastos[]>(
                process.env.DB_DATABASE_AUXILIAR||"", 
                `
                    select id, concepto, monto, usuario_gasto, autorizado, turno, fecha, UsuarioId 
                    from Gastos 
                    where CierreturnoId = ${cierre.id};
                `
            );
            cierre.gastos = gastos;
            return cierre;
    }))
    return cierres;
}