'use server';
import { IDepositos } from "@/interfaces";
import { executeQuery } from "@/utils/db";


interface TableResponseDepositosProps {
  depositos: IDepositos[];
  pageNumbers: number[];
}

export async function getDepositos(usuarioId: string, page: number, perPage: number, keyword?: string): Promise<TableResponseDepositosProps> {
   const start = (page * perPage) - (perPage - 1);
    const end = (page * perPage);
    try {
        const depositos = await executeQuery<IDepositos[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `select * from (
                        SELECT id,concepto,monto,usuario,turno,fecha,UsuarioId, ROW_NUMBER() OVER (ORDER BY id) AS RowNum FROM Depositos WHERE CierreturnoId IS NULL and UsuarioId = '${usuarioId}' 
                        ) as Result WHERE RowNum BETWEEN ${start} AND ${end} ;`
        );
        

        const total = await executeQuery<[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `SELECT id FROM Depositos WHERE CierreturnoId IS NULL AND UsuarioId = ${usuarioId}`
        );        
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(total.length / perPage); i++) {
            pageNumbers.push(i);
        }

        return {
            depositos : depositos as IDepositos[],
            pageNumbers
        }
    } catch (error) {
        console.error("Error fetching getDepositos:");
        console.error(JSON.stringify(error));
        throw error;
    }
}
export async function getDeposito(id: number): Promise<IDepositos> {
    try {
     const depositos = await executeQuery<IDepositos[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id,concepto,monto,usuario,turno,fecha,UsuarioId FROM Depositos WHERE id = ${id}`
    );
     return depositos[0] as IDepositos;
    } catch (error) {
        console.error("Error fetching getDeposito:");
        console.error(JSON.stringify(error));
        throw error;
    }
}