'use server';
import { saveCierreDiaTransaction } from '@/utils/db';
import { Session } from 'next-auth';

export async function saveCierreDia(session: Session|null, total: number): Promise<void> {
    try {
        return await saveCierreDiaTransaction(session, total);
    } catch (error) {
        console.error("Error saveCierreTurno");
        console.error(JSON.stringify(error));
        throw error;
    }    
}