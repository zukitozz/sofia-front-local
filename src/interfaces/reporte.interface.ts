export interface IReporteCierrePorDia {
    codigo: string;
    producto: string;
    ventas: number;
    cantidad: number;
    total: number;
}

export interface IReporteDeclaracionMensual {
    tipo_comprobante: string;
    tipo_documento: string;
    numero_documento: string;
    numeracion_comprobante: string;
    tipo_documento_afectado: string;
    numeracion_documento_afectado: string;
    fecha_emision: string;
    hora: string;
    total_gravadas: string;
    total_igv: string;
    total_venta: string;
    dec_combustible: string;
    volumen: string;
    pistola: string;
    tiempo_abastecimiento: string;
    ruc: string;
}