export interface IUser {
    id: number;
    nombre: string;
    usuario: string;
    correo: string;
    password?: string;
    img: string;
    rol: 'USER_ROLE'|'ADMIN_ROLE'|'SUPER_ROLE'
    estado: number;
    EmisorId: number;
}

export interface IUserForm {
    usuario: string;
    password: string;
}

export interface IUserLogin {
    id: string;
    nombre: string;
    usuario: string;
    correo?: string;        
    rol?: string; 
    grifo?: string;
    isla?: string;
    jornada?: string;
    fecha_registro?: string;
    islaId: number;
    pistolas?: number[];
}

export interface ICambioPasswordResponse {
    success: boolean;
    message: string;
}

export interface IDbResponse {
    success: boolean;
    message: string;
}

export interface IUserLogLogin {
    id?: string;
    terminal: string;
    isla: string;
    jornada: string;        
    ip: string; 
    fecha_fin?: string;
    fecha_inicio: string;
    UsuarioId: number;
}