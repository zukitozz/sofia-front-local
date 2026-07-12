import { IUser } from ".";

export interface ICierreTurnoDetalle {
    codigo: string;
    producto: string;
    medida: string;
    total_cantidad: number;
    total_soles: number;
    calibracion_cantidad: number;
    calibracion_soles: number;   
    despacho_cantidad: number;
    despacho_soles: number;
}

export interface ICierreTurnoSoles {
    efectivo: number;
    tarjeta: number;
    yape: number;
}

export interface IGastos {
    id: number;
    concepto: string;
    monto: number;    
    usuario_gasto: string;
    autorizado: string;
    turno: string;
    fecha: string;
    UsuarioId: number;
}

export interface IDepositos {
    id: number;
    concepto: string;
    monto: number;  
    usuario: string;  
    turno: string;
    fecha: string;
    UsuarioId: number;
      
}

export interface ICierreTurno {
    id: number;
    total: number;
    fecha: string;
    turno: string;
    isla: string;
    efectivo: number;
    tarjeta: number;
    yape: number;
    UsuarioId: number;
    detalle?: ICierreTurnoDetalle[];
    usuario?: IUser;
    depositos?: IDepositos[];
    gastos?: IGastos[];
}

export interface ICierreTurnoResponse {
    message: string;
    status: boolean;
}

export interface IUsuarioTurnoAbierto {
    UsuarioId: number;
    nombre: string;
    turno: string;
    isla: string;
    pendientes: number;
    desde: string;
}