import { IUserLogin } from "@/interfaces";

export function mapearUsuarioDBUsuarioLogin(user: any, isla: string, jornada: string, islaId: number, fecha: string, pistolas: number[]): IUserLogin {
    const { id, nombre, usuario, correo, rol } = user;
    return { 
        id, 
        nombre, 
        usuario, 
        correo, 
        rol, 
        grifo: process.env.NEXT_PUBLIC_RS, 
        isla, 
        jornada, 
        fecha_registro: fecha,
        islaId,
        pistolas
    };
}