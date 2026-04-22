export interface IDescuento {
    id: number;
    codigo_producto: string;
    numero_documento: string;
    monto_descuento: number;
    tipo: string;
    fecha: string;
    estado: number;
}

export interface IDescuentoTable extends IDescuento {
    descripcion_producto: string;
    cliente: string;
}