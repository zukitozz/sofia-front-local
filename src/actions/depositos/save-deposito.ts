'use server';
import { IDepositos } from '@/interfaces';
import { executeQuery } from '@/utils/db';

interface IDepositoStoreResponse {
    deposito: IDepositos|null;
    message: string;
    status: boolean;
}

export async function saveDeposito({ id, concepto, monto, usuario, turno, fecha, UsuarioId }: IDepositos): Promise<IDepositoStoreResponse> {
    let message = `Ocurrió un error al registrar depósito`
    try {
        const query = id? `UPDATE Depositos set concepto = '${concepto}', monto = ${monto}, usuario = '${usuario}', turno = '${turno}', fecha = '${fecha}' where id = ${id}` : `INSERT into Depositos (concepto, monto, usuario, turno, fecha, UsuarioId) values ('${concepto}', ${monto}, '${usuario}', '${turno}', '${fecha}', ${UsuarioId})`;
        await executeQuery<IDepositos[]>(
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