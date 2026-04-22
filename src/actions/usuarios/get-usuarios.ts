'use server';
import { IUser } from '@/interfaces';
import { executeQuery } from '@/utils/db';

interface TableResponseUsuariosProps {
  usuarios: IUser[];
  pageNumbers: number[];
}

export async function getUsuarios(page: number, perPage: number, keyword?: string): Promise<TableResponseUsuariosProps> {
    const start = (page * perPage) - (perPage - 1);
    const end = (page * perPage);
    try {
        const usuarios = await executeQuery<IUser[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `select * from (
                        SELECT id,nombre,usuario,correo,rol,estado, ROW_NUMBER() OVER (ORDER BY id) AS RowNum FROM Usuarios 
                        ) as Result WHERE RowNum BETWEEN ${start} AND ${end} ;`
        );
        

        const total = await executeQuery<[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `SELECT id FROM Usuarios WHERE estado = 1`
        );        
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(total.length / perPage); i++) {
            pageNumbers.push(i);
        }

        return {
            usuarios : usuarios as IUser[],
            pageNumbers
        }
    } catch (error) {
        console.error("Error fetching getUsuarios:");
        console.error(JSON.stringify(error));
        throw error;
    }
}