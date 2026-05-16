'use server';
import { IComprobanteAdmin } from '@/interfaces';
import { executeQuery, saveBillingTransaction } from '@/utils/db';

interface IComprobanteStoreResponse {
    bill: IComprobanteAdmin|null;
    message: string;
    status: boolean;
}

export async function saveBilling(comprobante: IComprobanteAdmin): Promise<IComprobanteStoreResponse> {
    let message = `Ocurrió un error al crear el comprobante`
    try {
        const bill = await saveBillingTransaction(comprobante);
        message = `Comprobante ${bill.numeracion_comprobante} creado coorrectamente`
        return {
            message,
            status: true,
            bill
        }         
    } catch (error) {
        console.error("Error saving comprobante:");
        console.error(JSON.stringify(error));
        return {
            message: `${message} | ${JSON.stringify(error)}`,
            status: false,
            bill: null
        }            
    }   
}
interface IReprintResponse {
    message: string;
    status: boolean;
}

export async function reprintBilling(id: number): Promise<IReprintResponse> {
    let message = `Ocurrió un error al solicitar reimpresión del comprobante`
    try {
        const query = `UPDATE Comprobantes set impresion = 0 where id = ${id}`;
        await executeQuery(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
        message = `Reimpresión del comprobante solicitada, espere unos segundos`;
        return {
            message,
            status: true
        }
    } catch (error) {
        return {
            message: `${message} | ${JSON.stringify(error)}`,
            status: false
        }   
    }
}
