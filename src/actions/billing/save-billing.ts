'use server';
import { IComprobanteAdmin } from '@/interfaces';
import { saveBillingTransaction } from '@/utils/db';

export async function saveBilling(comprobante: IComprobanteAdmin): Promise<IComprobanteAdmin> {
    try {
        return await saveBillingTransaction(comprobante);
    } catch (error) {
        console.error("Error saving comprobante:");
        console.error(JSON.stringify(error));
        throw error;
    }            
}
