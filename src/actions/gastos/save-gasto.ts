'use server';
import { IGastos } from '@/interfaces';
import { executeQuery } from '@/utils/db';

interface IGastoStoreResponse {
    deposito: IGastos|null;
    message: string;
    status: boolean;
}

export async function saveGasto({ id, concepto, monto, usuario_gasto, autorizado, turno, fecha, UsuarioId }: IGastos): Promise<IGastoStoreResponse> {
    let message = `Ocurrió un error al registrar gasto`
    try {
        const query = id? `UPDATE Gastos set concepto = '${concepto}', monto = ${monto}, usuario_gasto = '${usuario_gasto}', autorizado = '${autorizado}', turno = '${turno}', fecha = '${fecha}' where id = ${id}` : `INSERT into Gastos (concepto, monto, usuario_gasto, autorizado, turno, fecha, UsuarioId) values ('${concepto}', ${monto}, '${usuario_gasto}', '${autorizado}', '${turno}', '${fecha}', ${UsuarioId})`;
        await executeQuery<IGastos>(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
        message = `Depósito almacenado coorrectamente`;
        return {
            message,
            status: true,
            deposito: null
        }        
    } catch (error) {
        return {
            message: `${message} | ${JSON.stringify(error)}`,
            status: false,
            deposito: null
        }   
    }
}