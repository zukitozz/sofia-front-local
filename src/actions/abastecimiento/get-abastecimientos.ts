'use server';
import { EstadosAbastecimiento, IAbastecimiento } from '@/interfaces';
import { executeQuery } from '@/utils/db';


export async function getAbastecimientos(estado?: EstadosAbastecimiento): Promise<IAbastecimiento[]> {
    try {
     const abastecimientos = await executeQuery<IAbastecimiento[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT 
            a.idAbastecimiento, a.registro, a.pistola, a.codigoCombustible, a.numeroTanque, a.valorTotal, a.volTotal, a.precioUnitario, 
            a.tiempo, a.fechaHora, a.totInicio, a.totFinal, a.IDoperador, a.IDcliente, a.volTanque, a.estado, 
            p.nombre, p.color, p.medida  
        FROM 
        DEMOSQL.dbo.Abastecimientos a 
        INNER JOIN Productos p ON a.codigoCombustible = p.codigo${ estado !== undefined ? ' WHERE a.estado = ' + estado : ''}
        `
    );
     return abastecimientos;
    } catch (error) {
        console.error("Error fetching getAbastecimientos:");
        console.error(JSON.stringify(error));
        throw error;
    }
}
