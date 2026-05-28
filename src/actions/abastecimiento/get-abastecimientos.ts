'use server';
import { EstadosAbastecimiento, IAbastecimiento } from '@/interfaces';
import { executeQuery } from '@/utils/db';


export async function getAbastecimientos(pistolas: number[], estado?: EstadosAbastecimiento): Promise<IAbastecimiento[]> {
    try {
     const abastecimientos = await executeQuery<IAbastecimiento[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT 
            a.idAbastecimiento, a.registro, a.pistola, a.codigoCombustible, a.numeroTanque, a.valorTotal, a.volTotal, a.precioUnitario, 
            a.tiempo, a.fechaHora, a.totInicio, a.totFinal, a.IDoperador, a.IDcliente, a.volTanque, a.estado, 
            p.nombre, p.color, p.medida  
        FROM 
        DEMOSQL.dbo.Abastecimientos a 
        INNER JOIN Productos p ON a.codigoCombustible = p.codigo${ estado !== undefined ? ' WHERE a.valorTotal > 0 and a.estado = ' + estado : ''} 
        and a.pistola in (${pistolas.join(", ")}) 
        ORDER BY a.idAbastecimiento desc
        `
    );
     return abastecimientos;
    } catch (error) {
        console.error("Error fetching getAbastecimientos:");
        console.error(JSON.stringify(error));
        throw error;
    }
}
