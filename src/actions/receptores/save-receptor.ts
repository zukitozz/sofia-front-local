'use server';
import { IReceptor } from '@/interfaces';
import { executeQuery } from '@/utils/db';

export async function saveReceptor({ id, numero_documento, tipo_documento, razon_social, direccion, correo, placa }: IReceptor): Promise<IReceptor[]> {
    try {
        const query = id ? `UPDATE Receptores set numero_documento = '${numero_documento}', tipo_documento = '${tipo_documento}', razon_social = '${razon_social}', direccion = '${direccion}', correo = '${correo}', placa = '${placa}' where id = ${id}` : `INSERT into Receptores (numero_documento, tipo_documento, razon_social, direccion, correo, placa) values ('${numero_documento}', '${tipo_documento}', '${razon_social}', '${direccion}', '${correo}', '${placa}')`;
        const receptor = await executeQuery<IReceptor[]>(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
     return receptor as IReceptor[];
    } catch (error) {
        console.error("Error fetching getReceptores:");
        console.error(JSON.stringify(error));
        throw error;
    }
}