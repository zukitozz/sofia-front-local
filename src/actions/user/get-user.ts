'use server';
import { IUserForm, IUser } from '@/interfaces';
import { executeQuery } from '@/utils/db';

export async function getUserAuth(userForm: IUserForm): Promise<IUser|null> {
    const { usuario } = userForm;
    try {
     const user = await executeQuery<IUser[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id, nombre,usuario,correo,password,img,rol,estado,EmisorId FROM Usuarios WHERE usuario = '${usuario}' AND estado = 1`
    );
     return user[0] as IUser;
    } catch (error) {
        console.error("Error fetching getUserAuth:");
        console.error(JSON.stringify(error));
        throw error;
    }
}

interface IIslaReturn{
    id: number;
    nombre: string;
}

export async function getIslaAuth(ip: string): Promise<IIslaReturn> {
    
    try {
     const user = await executeQuery<any>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id, nombre FROM Islas WHERE ip = '${ip}' AND estado = 1`
    );
    
    return {
      id: user[0]?.id,
      nombre: user[0]?.nombre
    };
    } catch (error) {
        console.error("Error fetching getUserAuth:");
        console.error(JSON.stringify(error));
        return {
        id: 0,
        nombre: "NO_ISLA"
        };
    }
}

export async function getPistolaAuth(id_isla: number): Promise<number[]> {
    const retorno:number[] = []
    try {
     const pistolas = await executeQuery<any[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT codigo FROM Pistolas WHERE IslaId = ${id_isla}`
    );
    pistolas.forEach(pistola => retorno.push(pistola.codigo))
    return retorno;
    } catch (error) {
        console.error("Error fetching getPistolaAuth:");
        console.error(JSON.stringify(error));
        throw error;
    } 
}
