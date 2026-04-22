export interface IProduct {
    id: number;
    nombre: string;
    descripcion: string;
    imagenes?: string[];
    stock: number;
    codigo: string;
    medida: string;
    precio: number;
    valor: number;
    color: string;
    estado: number;
    img: string;
}
export interface IFuelProduct {
    id: number;
    id_auxiliar: string;
    desc: string;
}