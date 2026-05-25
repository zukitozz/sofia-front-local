'use server';
import { ICambioPasswordResponse, IUser } from '@/interfaces';
import { executeQuery } from '@/utils/db';
import { toLocaleStorage } from '@/utils/formats';

interface IUsuarioStoreResponse {
    producto: IUser|null;
    message: string;
    status: boolean;
}

export async function saveUsuario({ id, nombre, usuario, correo, rol }: IUser): Promise<IUsuarioStoreResponse> {
    let message = `Ocurrió un error al registrar usuario`;
    try {
        const query = id? `UPDATE Usuarios set nombre = '${nombre}', usuario = '${usuario}', correo = '${correo}' where id = ${id}` : `INSERT into Usuarios (nombre, usuario, correo, password, rol, EmisorId) values ('${nombre}', '${usuario}', '${correo}', 'MTIzNA==', '${rol}', 1)`;
        const user = await executeQuery<IUser[]>(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
         message = `Usuario almacenado correctamente`;
        return {
            message,
            status: true,
            producto: null
        }   
    } catch (error) {
        return {
            message: `${message} | ${JSON.stringify(error)}`,
            status: false,
            producto: null
        }   
    }
}

export async function getUsuario(id: number): Promise<IUser> {
    try {
     const usuarios = await executeQuery<IUser[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id,nombre,usuario,correo,rol FROM Usuarios WHERE id = ${id}`
    );
     return usuarios[0] as IUser;
    } catch (error) {
        console.error("Error fetching getUsuario:");
        console.error(JSON.stringify(error));
        throw error;
    }
}

export async function getUsuarioPass(id: number): Promise<IUser> {
    try {
     const usuarios = await executeQuery<IUser[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id,nombre,usuario,correo,password,rol FROM Usuarios WHERE id = ${id}`
    );
     return usuarios[0] as IUser;
    } catch (error) {
        console.error("Error fetching getUsuario:");
        console.error(JSON.stringify(error));
        throw error;
    }
}

export async function changePassword(id: number, prevPassword: string, newPassword: string, isla: string): Promise<ICambioPasswordResponse> {
    try {
        await executeQuery(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `INSERT INTO CambioPassword (UsuarioId, fecha_registro, isla) VALUES (${id}, '${toLocaleStorage(new Date())}', '${isla}')`
        );        
        const usuario = await getUsuarioPass(id);
        const passwordPrevEncoded = Buffer.from(prevPassword, 'binary').toString('base64');
        if( passwordPrevEncoded != usuario.password ) return { success: false, message: 'Contraseña anterior incorrecta' };
        const newPasswordEncoded = Buffer.from(newPassword, 'binary').toString('base64');
        await executeQuery(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `UPDATE Usuarios set password = '${newPasswordEncoded}' where id = ${id}`
        );
    } catch (error) {
        console.error("Error fetching changePassword:");
        console.error(JSON.stringify(error));
        return { success: false, message: 'Ocurrió un error al cambiar la contraseña' };
    }

    return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
    }
}