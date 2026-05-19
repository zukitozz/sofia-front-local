import moment from 'moment';
import { IComprobanteAdmin, IComprobanteAdminItem, IReceptor } from "@/interfaces";
import { toLocaleStorage } from '@/utils';

export class Comprobante implements IComprobanteAdmin{
    id?: number;
    tipo_comprobante: string;
    numeracion: string;
    numeracion_comprobante: string;
    fecha_emision: string;
    tipo_moneda: string;
    tipo_operacion: string;
    tipo_nota: string | null;
    tipo_documento_afectado: string | null;
    fecha_documento_afectado: string | null;
    numeracion_documento_afectado: string | null;
    motivo_documento_afectado: string | null;
    gravadas: number;
    igv: number;
    total: number;
    monto_letras: string | null;
    cadena_para_codigo_qr?: string;
    codigo_hash?: string;
    pdf?: string;
    url?: string;
    errors?: string;
    id_abastecimiento: number;
    pistola?: number;
    inicio_medidor?: number;
    fin_medidor?: number;
    codigo_combustible: string;
    dec_combustible: string;
    volumen: number;
    fecha_abastecimiento: string | null;
    tiempo_abastecimiento: number| null;
    volumen_tanque: number;
    comentario: string;
    tarjeta: number;
    efectivo: number;
    yape: number;
    placa: string|null;
    billete?: number;
    producto_precio: number| null;
    ruc: string;
    enviado: number;
    estado_nota_despacho: string|null;
    comprobante_nota_despacho: string|null;
    fecha_facturado_nota_despacho: string|null;
    Receptor: IReceptor;
    UsuarioId: number;
    fecha_hora: string;
    items: IComprobanteAdminItem[];
    impresion?: number;
    IslaId: number;
    constructor(
        receptor: IReceptor, tipo_comprobante: string, gravadas: number, igv: number, total: number, tarjeta: number, efectivo: number, yape: number,
        ruc: string, UsuarioId: number, items: IComprobanteAdminItem[], placa: string|null, 
        fecha_abastecimiento: Date|null, tiempo_abastecimiento: number | null, IslaId: number, 
        id_abastecimiento: number = 0, pistola: number = 0, codigo_combustible: string = "", volumen: number = 0, 
        volumen_tanque: number = 0, dec_combustible: string = "", comentario: string = ""
    ) {
        this.tipo_comprobante = tipo_comprobante;
        this.numeracion = "";
        this.numeracion_comprobante = "";
        this.fecha_emision = toLocaleStorage(new Date());
        this.tipo_moneda = "PEN";
        this.tipo_operacion = "0101";
        this.tipo_nota = null;
        this.tipo_documento_afectado = null;
        this.fecha_documento_afectado = null;
        this.numeracion_documento_afectado = null;
        this.motivo_documento_afectado = null;
        this.gravadas = gravadas;
        this.igv = igv;
        this.total = total;
        this.monto_letras = null;
        this.id_abastecimiento = id_abastecimiento;
        this.pistola = pistola;
        this.tarjeta = tarjeta;
        this.efectivo = efectivo;
        this.yape = yape;
        this.ruc = ruc;
        this.enviado = 0;
        this.items = items;
        this.fecha_hora = toLocaleStorage(new Date());
        this.Receptor = receptor;
        this.codigo_combustible = codigo_combustible;
        this.volumen = volumen;
        this.dec_combustible = dec_combustible;
        this.fecha_abastecimiento = moment(fecha_abastecimiento).format("YYYY-MM-DD HH:mm:ss");
        this.tiempo_abastecimiento = tiempo_abastecimiento;
        this.volumen_tanque = volumen_tanque;
        this.comentario = comentario;
        this.UsuarioId = UsuarioId;
        this.placa = placa;
        this.producto_precio = null;
        this.estado_nota_despacho = null;
        this.comprobante_nota_despacho = null;
        this.fecha_facturado_nota_despacho = null;
        this.impresion = 0;
        this.IslaId = IslaId;
    }
    toPlainObject() {
        return { ...this };
    }

}