"use server";
import { IComprobanteAdmin } from '@/interfaces';
import { executeQuery } from '@/utils/db';

export async function saveBillingResponse({ id, xml_envio, codigo_hash, cadena_para_codigo_qr, url, errors }: IComprobanteAdmin): Promise<void> {
    try {
        const query = `UPDATE Comprobantes 
            SET xml_envio = '${xml_envio}', codigo_hash = '${codigo_hash}', cadena_para_codigo_qr = '${cadena_para_codigo_qr}', url = '${url}', errors = '${errors}', enviado = '1'
            WHERE 
            id = ${id}
            `;
        await executeQuery<IComprobanteAdmin[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            query
        );
    } catch (error) {
        console.error("Error fetching saveBillingResponse");
        console.error(JSON.stringify(error));
        throw error;
    }    

}
