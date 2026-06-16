"use server";
import { ICierreTurnoDetalle, ICierreTurnoSoles, ICierreTurnoResponse } from "@/interfaces";
import { executeQuery, saveCierreTurnoTransaction } from '@/utils/db';
import { Session } from "next-auth";

export async function saveCierreTurno(session: Session|null, total: number, soles: ICierreTurnoSoles, productos: ICierreTurnoDetalle[]): Promise<ICierreTurnoResponse> {
    return await saveCierreTurnoTransaction(session, total, soles, productos);  
}

interface IGenericResponse {
    message: string;
    status: boolean;
}

export async function reprintCierre(session: Session|null): Promise<IGenericResponse> {
    let message = `Ocurrió un error al solicitar reimpresión del comprobante`
    const id = session?.user?.id || 0;
    const isla = session?.user?.isla || "";
    try {
        const query = `UPDATE Cierreturnos set impresion = 0, isla = '${isla}' where id = ${id}`;
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