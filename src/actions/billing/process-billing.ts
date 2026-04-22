"use server";
import { IComprobanteAdmin, IComprobanteAdminItem, IReceptor } from '@/interfaces';
import { executeQuery } from '@/utils/db';

export async function getBillingToProcess(): Promise<IComprobanteAdmin|null> {
    try {
        const comprobantes = await executeQuery<IComprobanteAdmin[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `SELECT TOP 1 
                id,tipo_comprobante,numeracion_comprobante,CONVERT(char(10), fecha_emision,126) as fecha_emision,tipo_moneda,tipo_operacion,tipo_nota,tipo_documento_afectado,
                fecha_documento_afectado,numeracion_documento_afectado,motivo_documento_afectado,total_gravadas,total_igv,total_venta,monto_letras,
                cadena_para_codigo_qr,codigo_hash,pdf_bytes,url,errors,id_abastecimiento,pistola,codigo_combustible,dec_combustible,volumen,
                fecha_abastecimiento,tiempo_abastecimiento,volumen_tanque,comentario,pago_tarjeta,pago_efectivo,pago_yape,placa,billete,producto_precio,ruc,
                enviado,estado_nota_despacho,comprobante_nota_despacho,fecha_facturado_nota_despacho,ReceptorId,UsuarioId,CierreturnoId,fecha_hora,gravadas,
                igv,total,inicio_medidor,fin_medidor
            FROM 
                Comprobantes 
            WHERE tipo_comprobante in ('01','03') and enviado = '0'
            `
        );
        if (comprobantes.length == 0 )
            return null;
        const comprobante = comprobantes[0];
        
        const items = await executeQuery<IComprobanteAdminItem[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `SELECT 
                cantidad as cantidad_string,precio_unitario as precio_unitario_string,valor_unitario as valor_unitario_string,igv as igv_string,descripcion,codigo_producto,medida,
                valor_venta,precio_venta,valor,precio,igv as igv_venta,codigo,cantidad as cantidad_venta
            FROM 
                Items 
            WHERE 
                ComprobanteId = ${comprobante.id}
            `
        );
        comprobante.items = items;
        const receptores = await executeQuery<IReceptor[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `SELECT 
                id,numero_documento,tipo_documento,razon_social,direccion,correo,placa 
            FROM 
                Receptores 
            WHERE 
                id = ${(comprobante as any).ReceptorId}
            `
        );
        comprobante.Receptor = receptores[0];
        return comprobante;
    } catch (error) {
        console.error("Error fetching getBillingToProcess:");
        console.error(JSON.stringify(error));
        throw error;
    }    

}
