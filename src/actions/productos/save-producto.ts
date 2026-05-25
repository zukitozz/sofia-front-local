'use server';
import { IProduct } from '@/interfaces';
import { executeQuery } from '@/utils/db';
import { Constants, redondear } from "@/utils";


interface IProductoStoreResponse {
    producto: IProduct|null;
    message: string;
    status: boolean;
}

export async function saveProducto({ id, medida, nombre, descripcion, precio, img, tipo }: IProduct): Promise<IProductoStoreResponse> {
    let message = `Ocurrió un error al registrar gasto`
    try {
        const redondeo: number = medida === Constants.MEDIDA.GALON ? 10 : 2;
        const taxRate = Number.parseFloat(process.env.NEXT_PUBLIC_TAX || "0.18");
        const valor = precio/(1 + taxRate);
        const query = id? `UPDATE Productos set nombre = '${nombre}', descripcion = '${descripcion}', medida = '${medida}', precio = ${precio}, valor = ${redondear(valor, redondeo)}, img = '${img}', tipo = '${tipo}' where id = ${id}` : `INSERT into Productos (nombre, descripcion, medida, precio, valor, img, tipo) values ('${nombre}', '${descripcion}', '${medida}', ${precio}, ${redondear(valor, redondeo)}, '${img}', '${tipo}')`;
        await executeQuery<IProduct[]>(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
        message = `Depósito almacenado coorrectamente`;
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