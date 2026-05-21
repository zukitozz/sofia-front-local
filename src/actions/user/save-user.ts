'use server';
import { IUserLogLogin } from '@/interfaces';
import { executeQuery } from '@/utils/db';

export async function saveLogin({ terminal, isla, jornada, ip, fecha_inicio, UsuarioId }: IUserLogLogin): Promise<string> {
    try {

        const new_loguin =await executeQuery<IUserLogLogin>(
            process.env.DB_DATABASE_AUXILIAR||"", `INSERT into Logins (terminal, isla, jornada, ip, fecha_inicio, UsuarioId) OUTPUT inserted.* values ('${terminal}', '${isla}', '${jornada}', '${ip}', '${fecha_inicio}', ${UsuarioId})`
            
        );          
        const prev_loguin = await executeQuery<IUserLogLogin[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `SELECT TOP 1 * FROM Logins WHERE UsuarioId = ${UsuarioId} and jornada = '${jornada}' and fecha_fin is null ORDER BY id ASC`
        );
        if(prev_loguin.length === 0){
            return new_loguin.fecha_inicio;
        }
        return prev_loguin[0].fecha_inicio;

    } catch (error) {
        console.error("Error fetching getReceptores:");
        console.error(JSON.stringify(error));
        throw error;
    }
}