export interface IReceptor {
    id: number;
    tipo_documento: string;
    numero_documento: string;
    razon_social: string;
    direccion: string;
    placa: string;
    correo?: string;
}

export interface IReceptorPlaca extends IReceptor {
    placa: string;
}
