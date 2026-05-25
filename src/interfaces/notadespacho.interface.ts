import { IComprobanteAdmin } from "./comprobante.interface";

export interface INotaDespacho {
    valor: number;
    precio: number;
    igv: number;
    descripcion: string;
    items: IComprobanteAdmin[];
}