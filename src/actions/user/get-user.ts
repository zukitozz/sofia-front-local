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

export async function getIslaAuth(ip: string): Promise<string> {
    try {
     const user = await executeQuery<any>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT nombre FROM Islas WHERE ip = '${ip}' AND estado = 1`
    );
    return user[0]?.nombre || "NO_ISLA";
    } catch (error) {
        console.error("Error fetching getUserAuth:");
        console.error(JSON.stringify(error));
        return "NO_ISLA";
    }
}
