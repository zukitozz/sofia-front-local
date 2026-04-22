'use server';
import { IGastos } from '@/interfaces';
import { executeQuery } from '@/utils/db';

export async function saveGasto({ id, concepto, monto, usuario_gasto, autorizado, turno, fecha, UsuarioId }: IGastos): Promise<IGastos[]> {
    try {
        const query = id? `UPDATE Gastos set concepto = '${concepto}', monto = ${monto}, usuario_gasto = '${usuario_gasto}', autorizado = '${autorizado}', turno = '${turno}', fecha = '${fecha}' where id = ${id}` : `INSERT into Gastos (concepto, monto, usuario_gasto, autorizado, turno, fecha, UsuarioId) values ('${concepto}', ${monto}, '${usuario_gasto}', '${autorizado}', '${turno}', '${fecha}', ${UsuarioId})`;
        const receptor = await executeQuery<IGastos[]>(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
     return receptor as IGastos[];
    } catch (error) {
        console.error("Error fetching getGastos:");
        console.error(JSON.stringify(error));
        throw error;
    }
}