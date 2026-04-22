'use server';
import { IDepositos } from '@/interfaces';
import { executeQuery } from '@/utils/db';

export async function saveDeposito({ id, concepto, monto, usuario, turno, fecha, UsuarioId }: IDepositos): Promise<IDepositos[]> {
    try {
        const query = id? `UPDATE Depositos set concepto = '${concepto}', monto = ${monto}, usuario = '${usuario}', turno = '${turno}', fecha = '${fecha}' where id = ${id}` : `INSERT into Depositos (concepto, monto, usuario, turno, fecha, UsuarioId) values ('${concepto}', ${monto}, '${usuario}', '${turno}', '${fecha}', ${UsuarioId})`;
        const receptor = await executeQuery<IDepositos[]>(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
     return receptor as IDepositos[];
    } catch (error) {
        console.error("Error fetching saveDeposito:");
        console.error(JSON.stringify(error));
        throw error;
    }
}