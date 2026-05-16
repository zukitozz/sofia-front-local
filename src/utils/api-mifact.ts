"use server";
import axios from 'axios';
import { IComprobanteAdmin, IComprobanteAdminItem } from '@/interfaces';
import { Constants } from './constants';
import posApi from './posApi';

export interface PropsMiFact {
    hasErrorMiFact: boolean; 
    comprobante: IComprobanteAdmin;
}
export interface PropsConsultaRucMiFact {
    hasErrorMiFact: boolean;
    messageMiFact: string;
    razon_social: string | null;
    direccion: string | null;
}

interface ResponseMiFact {
    cadena_para_codigo_qr: string;
    cdr_sunat: string;
    codigo_hash: string;
    correlativo_cpe: string;
}

export const createOrderApiMiFact = async(comprobante : IComprobanteAdmin): Promise<PropsMiFact> => {
    try {
        const splitted = comprobante.numeracion_comprobante.split("-");
        const splitedAfectado =  comprobante.numeracion_documento_afectado?.split("-");
        const arr_items: any = [] 
        const placa = comprobante.placa? ('| PLACA: ' + comprobante.placa.toUpperCase()) :''
        comprobante.items.forEach((item:IComprobanteAdminItem) => {
            arr_items.push(
                {
                    "COD_ITEM": "BCF-RR01",
                    "COD_UNID_ITEM": item.medida?item.medida:"GLL",
                    "CANT_UNID_ITEM": item.cantidad_venta,
                    "VAL_UNIT_ITEM": item.valor,
                    "PRC_VTA_UNIT_ITEM": item.precio,      
                    "VAL_VTA_ITEM": item.valor_venta.toFixed(2),
                    "MNT_BRUTO": item.valor_venta.toFixed(2),
                    "MNT_PV_ITEM": item.precio_venta,
                    "COD_TIP_PRC_VTA": "01",
                    "COD_TIP_AFECT_IGV_ITEM":"10",
                    "COD_TRIB_IGV_ITEM": "1000",
                    "POR_IGV_ITEM": "18",
                    "MNT_IGV_ITEM": item.igv_venta,
                    "TXT_DESC_ITEM": `${item.descripcion}${placa}`,
                    "DET_VAL_ADIC01": "",
                    "DET_VAL_ADIC02": "",
                    "DET_VAL_ADIC03": "",
                    "DET_VAL_ADIC04": ""                
                }
            )
        });
        const body = {
            "TOKEN":"gN8zNRBV+/FVxTLwdaZx0w==", // token del emisor, este token gN8zNRBV+/FVxTLwdaZx0w== es de pruebas
            "COD_TIP_NIF_EMIS": "6",
            "NUM_NIF_EMIS": "20100100100",//20100100100            
            // "TOKEN":"tOcEEdPoW/SnZ0lYcWH/eA==", // token del emisor, este token gN8zNRBV+/FVxTLwdaZx0w== es de pruebas
            // "COD_TIP_NIF_EMIS": "6",
            // "NUM_NIF_EMIS": "20609785269",
            "NOM_RZN_SOC_EMIS": process.env.NEXT_PUBLIC_RS,
            "NOM_COMER_EMIS": process.env.EMISOR_COMERCIAL,
            "COD_UBI_EMIS": process.env.NEXT_PUBLIC_UBIGEO,
            "TXT_DMCL_FISC_EMIS": process.env.NEXT_PUBLIC_EMISOR_DIR,
            "COD_TIP_NIF_RECP": comprobante.Receptor.tipo_documento,
            "NUM_NIF_RECP": comprobante.Receptor.numero_documento,
            "NOM_RZN_SOC_RECP": comprobante.Receptor.razon_social,
            "TXT_DMCL_FISC_RECEP": comprobante.Receptor.direccion,
            "FEC_EMIS": comprobante.fecha_emision,
            "FEC_VENCIMIENTO": "",
            "COD_TIP_CPE": comprobante.tipo_comprobante,
            "NUM_SERIE_CPE": splitted[0],
            "NUM_CORRE_CPE": splitted[1],
            "COD_MND": "PEN",
            "MailEnvio": comprobante.Receptor.correo,
            "COD_PRCD_CARGA": "001",
            "MNT_TOT_GRAVADO": comprobante.gravadas, 
            "MNT_TOT_TRIB_IGV": comprobante.igv, 
            "MNT_TOT": comprobante.total, 
            "COD_PTO_VENTA": "jmifact",
            "ENVIAR_A_SUNAT": "false",
            "RETORNA_XML_ENVIO": "false",
            "RETORNA_XML_CDR": "false",
            "RETORNA_PDF": "true",
            "COD_FORM_IMPR":"001",
            "TXT_VERS_UBL":"2.1",
            "TXT_VERS_ESTRUCT_UBL":"2.0",
            "COD_ANEXO_EMIS":"0000",
            "COD_TIP_OPE_SUNAT": "0101",
            "COD_TIP_NC": (comprobante.tipo_comprobante == Constants.TIPO_COMPROBANTE.NOTA_CREDITO)?"01":"",
            "TXT_DESC_MTVO": (comprobante.tipo_comprobante == Constants.TIPO_COMPROBANTE.NOTA_CREDITO)?"anulacion de comprobante":"",
            "items": arr_items,
            "docs_referenciado": [
                {
                    "COD_TIP_DOC_REF": splitedAfectado? comprobante.tipo_documento_afectado : "",
                    "NUM_SERIE_CPE_REF": splitedAfectado? splitedAfectado[0]: "",
                    "NUM_CORRE_CPE_REF": splitedAfectado? splitedAfectado[1]: "",
                    "FEC_DOC_REF": splitedAfectado? comprobante.fecha_documento_afectado: ""
                }
          ]
        }
        comprobante.xml_envio = JSON.stringify(body);
        
        const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_MIFACT_API}`, body);

        if(data.errors){
            comprobante.errors = data.errors;
            return {
                hasErrorMiFact: false,
                comprobante
            }
        }else{
            comprobante.cadena_para_codigo_qr = data.cadena_para_codigo_qr;
            comprobante.codigo_hash = data.codigo_hash;
            comprobante.url = data.url;
            comprobante.errors = data.errors;
            return {
                hasErrorMiFact: false,
                comprobante
            }
        }
    } catch (error: any) {
        
        if ( axios.isAxiosError(error) ) {
            return {
                hasErrorMiFact: true,
                comprobante
            }
        }
        return {
            hasErrorMiFact: true,
            comprobante
        }        
    }
    
}

export const consultaRucMiFact = async (ruc: string): Promise<PropsConsultaRucMiFact> => {

    try {
        const body = {
            "TOKEN": `${process.env.NEXT_PUBLIC_CONSULTA_RUC_TOKEN}`,
            "RUC_RECEPTOR": ruc     
        }

        const { data } = await posApi.post(`${process.env.NEXT_PUBLIC_CONSULTA_RUC}`, body);

        if(data.aCod_MensajeAPP == "0"){
            return {
                hasErrorMiFact: false,
                messageMiFact: "consultaRucMiFact: " + data.aCod_MensajeAPP,
                razon_social: data.aRazon_Social,
                direccion: data.aDireccion_Fiscal
            }
        }else{
            return {
                hasErrorMiFact: true,
                messageMiFact: "consultaRucMiFact: " + data.aCod_MensajeAPP,
                razon_social: null,
                direccion: null
            }            
        }  
        
    } catch (error: any) {
        if ( axios.isAxiosError(error) ) {
            return {
                hasErrorMiFact: true,
                messageMiFact: "createOrderApiMiFact: " + error.response?.data.message,
                razon_social: null,
                direccion: null
            }
        }
        return {
            hasErrorMiFact: true,
            messageMiFact : 'Error no controlado, hable con el administrador ' + error,
            razon_social: null,
            direccion: null
        }        
    }
}