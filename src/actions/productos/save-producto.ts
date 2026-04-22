'use server';
import { IProduct } from '@/interfaces';
import { executeQuery } from '@/utils/db';
import { Constants, redondear } from "@/utils";

export async function saveProducto({ id, medida, nombre, descripcion, precio }: IProduct): Promise<IProduct[]> {
    try {
        const redondeo: number = medida === Constants.MEDIDA.GALON ? 10 : 2;
        const valor = precio/1.18;
        const query = id? `UPDATE Productos set nombre = '${nombre}', descripcion = '${descripcion}', medida = '${medida}', precio = ${precio}, valor = ${redondear(valor, redondeo)} where id = ${id}` : `INSERT into Productos (nombre, descripcion, medida, precio, valor) values ('${nombre}', '${descripcion}', '${medida}', ${precio}, ${redondear(valor, redondeo)})`
        const receptor = await executeQuery<IProduct[]>(
            process.env.DB_DATABASE_AUXILIAR||"", query
            
        );
     return receptor as IProduct[];
    } catch (error) {
        console.error("Error fetching getProductos:");
        console.error(JSON.stringify(error));
        throw error;
    }
}