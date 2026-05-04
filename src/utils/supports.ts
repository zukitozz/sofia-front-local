import { IUserLogin } from "@/interfaces";

export function mapearUsuarioDBUsuarioLogin(user: any, isla: string, jornada: string, islaId: number, pistolas: number[]): IUserLogin {
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
        fecha_registro: new Date().toLocaleString('sv-SE', {timeZone: 'America/Lima' }),
        islaId,
        pistolas
    };
}