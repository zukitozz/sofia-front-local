"use server";
import { ICierreTurnoDetalle, ICierreTurnoSoles, ICierreTurnoResponse } from "@/interfaces";
import { saveCierreTurnoTransaction } from '@/utils/db';
import { Session } from "next-auth";

export async function saveCierreTurno(session: Session|null, total: number, soles: ICierreTurnoSoles, productos: ICierreTurnoDetalle[]): Promise<ICierreTurnoResponse> {
    return await saveCierreTurnoTransaction(session, total, soles, productos);  
}