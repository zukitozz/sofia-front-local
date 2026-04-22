'use server';
import { IGastos } from "@/interfaces";
import { executeQuery } from "@/utils/db";


interface TableResponseGastosProps {
  gastos: IGastos[];
  pageNumbers: number[];
}

export async function getGastos(usuarioId: string, page: number, perPage: number, keyword?: string): Promise<TableResponseGastosProps> {
   const start = (page * perPage) - (perPage - 1);
    const end = (page * perPage);
    try {
        const gastos = await executeQuery<IGastos[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `select * from (
                        SELECT id,concepto,monto,autorizado,turno,fecha,UsuarioId, ROW_NUMBER() OVER (ORDER BY id) AS RowNum FROM Gastos WHERE CierreturnoId IS NULL and UsuarioId = '${usuarioId}' 
                        ) as Result WHERE RowNum BETWEEN ${start} AND ${end} ;`
        );
        

        const total = await executeQuery<[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `SELECT id FROM Gastos WHERE CierreturnoId IS NULL AND UsuarioId = ${usuarioId}`
        );        
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(total.length / perPage); i++) {
            pageNumbers.push(i);
        }

        return {
            gastos : gastos as IGastos[],
            pageNumbers
        }
    } catch (error) {
        console.error("Error fetching getGastos:");
        console.error(JSON.stringify(error));
        throw error;
    }
}
export async function getGasto(id: number): Promise<IGastos> {
    try {
     const gastos = await executeQuery<IGastos[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id,concepto,monto,autorizado,turno,fecha,UsuarioId FROM Gastos WHERE id = ${id}`
    );
     return gastos[0] as IGastos;
    } catch (error) {
        console.error("Error fetching getGasto:");
        console.error(JSON.stringify(error));
        throw error;
    }
}