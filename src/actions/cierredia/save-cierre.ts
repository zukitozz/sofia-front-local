'use server';
import { saveCierreDiaTransaction } from '@/utils/db';

export async function saveCierreDia(total: number, isla: string): Promise<void> {
    try {
        return await saveCierreDiaTransaction(total, isla);
    } catch (error) {
        console.error("Error saveCierreTurno");
        console.error(JSON.stringify(error));
        throw error;
    }    
}