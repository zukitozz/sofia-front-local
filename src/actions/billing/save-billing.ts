'use server';
import { IComprobanteAdmin } from '@/interfaces';
import { saveBillingTransaction } from '@/utils/db';

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
