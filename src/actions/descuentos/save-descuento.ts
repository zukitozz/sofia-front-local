'use server';
import { IDescuento, IDbResponse } from '@/interfaces';
import { executeQuery } from '@/utils/db';
import { toLocaleStorage } from '@/utils';

export async function saveDescuento({ id, codigo_producto, numero_documento, monto_descuento, tipo, estado }: IDescuento): Promise<IDbResponse> {
    try {
        if(!id){
            const existingDescuento = await executeQuery<IDescuento[]>(
                process.env.DB_DATABASE_AUXILIAR||"", `SELECT * FROM Descuentos WHERE numero_documento = '${numero_documento}' AND codigo_producto = '${codigo_producto}'`
            );
            if(existingDescuento.length > 0){
                return { success: false, message: 'Ya existe un descuento para este producto y cliente' };
            }

        }
        const query = id? `UPDATE Descuentos set monto_descuento = '${monto_descuento}', tipo = '${tipo}', fecha = '${toLocaleStorage(new Date())}', estado = ${estado} where id = ${id}` : `INSERT into Descuentos (codigo_producto, numero_documento, monto_descuento, tipo, fecha, estado) values ('${codigo_producto}', '${numero_documento}', '${monto_descuento}', '${tipo}', '${toLocaleStorage(new Date())}', ${estado})`
        await executeQuery<IDescuento[]>(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
     return { success: true, message: 'Descuento guardado correctamente' };
    } catch (error) {
        console.error("Error fetching saveDescuento:");
        console.error(JSON.stringify(error));
        throw error;
    }
}