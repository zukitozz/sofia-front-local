'use server';
import { saveCierreDiaTransaction } from '@/utils/db';

export async function saveCierreDia(total: number): Promise<void> {
    try {
        return await saveCierreDiaTransaction(total);
    } catch (error) {
        console.error("Error saveCierreTurno");
        console.error(JSON.stringify(error));
        throw error;
    }    
}