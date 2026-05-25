"use server";
import { IComprobanteAdmin, IComprobanteAdminItem, IReceptor } from "@/interfaces";
import { Constants } from "@/utils/constants";
import { executeQuery } from '@/utils/db';

export async function obtieneNotasDespacho(): Promise<IComprobanteAdmin[]> {
    const comprobantes = await executeQuery<IComprobanteAdmin[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `
            select *   
            from Comprobantes 
            where tipo_comprobante = ${Constants.TIPO_COMPROBANTE.NOTA_DESPACHO} and estado_nota_despacho is null;
        `
    );
    await Promise.all(
        comprobantes.map(async comprobante => {
            const items = await executeQuery<IComprobanteAdminItem[]>(
                process.env.DB_DATABASE_AUXILIAR||"", 
                `
                    select * 
                    from Items 
                    where ComprobanteId = ${comprobante.id};
                `
            );
            comprobante.items = items;
            const receptor = await executeQuery<IReceptor[]>(
                process.env.DB_DATABASE_AUXILIAR||"", 
                `
                    select * 
                    from Receptores 
                    where id = ${comprobante.ReceptorId};
                `
            );
            comprobante.Receptor = receptor[0];
            return comprobante;
        })
    )
 
    return comprobantes;
}