'use server';
import { ICierreTurnoResponse } from '@/interfaces/cierreturno.interface';
import { saveCierreDiaTransaction } from '@/utils/db';
import { Session } from 'next-auth';

export async function saveCierreDia(session: Session|null, total: number): Promise<ICierreTurnoResponse> {
    try {
        return await saveCierreDiaTransaction(session, total);
    } catch (error) {
        console.error("Error saveCierreDia");
        console.error(JSON.stringify(error));
        throw error;
    }    
}