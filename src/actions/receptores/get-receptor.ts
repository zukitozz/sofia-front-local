'use server';
import { IReceptor } from '@/interfaces';
import { executeQuery } from '@/utils/db';

interface TableResponseReceptoresProps {
  receptores: IReceptor[];
  pageNumbers: number[];
}

export async function getReceptores(page: number, perPage: number, keyword?: string): Promise<TableResponseReceptoresProps> {
    const start = (page * perPage) - (perPage - 1);
    const end = (page * perPage);

    let filtroAdicional = "";
    if (keyword && keyword.trim() !== "") {
        filtroAdicional = ` AND (numero_documento LIKE '%${keyword.trim()}%' OR razon_social LIKE '%${keyword.trim()}%')`;
    }
    const query = `select * from (
                        SELECT id,numero_documento,tipo_documento,razon_social,direccion,correo,placa, ROW_NUMBER() OVER (ORDER BY id) AS RowNum FROM Receptores 
                        ) as Result WHERE RowNum BETWEEN ${start} AND ${end} ${filtroAdicional} ;`
    
    try {
        const receptores = await executeQuery<IReceptor[]>(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
        

        const total = await executeQuery<[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `SELECT id FROM Receptores`
        );        
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(total.length / perPage); i++) {
            pageNumbers.push(i);
        }

        return {
            receptores : receptores as IReceptor[],
            pageNumbers
        }
    } catch (error) {
        console.error("Error fetching getReceptores:");
        console.error(JSON.stringify(error));
        throw error;
    }
}

export async function getReceptor(id: number): Promise<IReceptor> {
    try {
     const receptores = await executeQuery<IReceptor[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id,numero_documento,tipo_documento,razon_social,direccion,correo,placa FROM Receptores WHERE id = ${id}`
    );
     return receptores[0] as IReceptor;
    } catch (error) {
        console.error("Error fetching getReceptor:");
        console.error(JSON.stringify(error));
        throw error;
    }
}

export async function getReceptorByDocumento(numero_documento: string): Promise<IReceptor> {
    try {
     const receptor = await executeQuery<IReceptor[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id, tipo_documento,numero_documento,razon_social,direccion,correo,placa FROM Receptores WHERE numero_documento = '${numero_documento}'`
    );
     return receptor[0] as IReceptor;
    } catch (error) {
        console.error("Error fetching getReceptor:");
        console.error(JSON.stringify(error));
        throw error;
    }
}

export async function getReceptorByRazonSocial(razon_social: string): Promise<IReceptor[]> {
    try {
     const receptor = await executeQuery<IReceptor[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT TOP 10 id, tipo_documento,numero_documento,razon_social,direccion,correo,placa FROM Receptores WHERE razon_social like '%${razon_social}%'`
    );   
     return receptor as IReceptor[];
    } catch (error) {
        console.error("Error fetching getReceptor:");
        console.error(JSON.stringify(error));
        throw error;
    }
}