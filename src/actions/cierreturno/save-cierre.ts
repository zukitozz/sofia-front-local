"use server";
import { ICierreTurnoDetalle, ICierreTurnoSoles } from "@/interfaces";
import { saveCierreTurnoTransaction } from '@/utils/db';
import { Session } from "next-auth";

export async function saveCierreTurno(session: Session|null, total: number, soles: ICierreTurnoSoles, productos: ICierreTurnoDetalle[]): Promise<void> {
    try {
        return await saveCierreTurnoTransaction(session, total, soles, productos);
    } catch (error) {
        console.error("Error saveCierreTurno");
        console.error(JSON.stringify(error));
        throw error;
    }    
}