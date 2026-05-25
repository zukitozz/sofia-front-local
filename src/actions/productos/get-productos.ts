'use server';
import { IProduct } from '@/interfaces';
import { executeQuery } from '@/utils/db';

interface TableResponseProductsProps {
  products: IProduct[];
  pageNumbers: number[];
}

export async function getProductos(page: number, perPage: number, keyword?: string): Promise<TableResponseProductsProps> {
    const start = (page * perPage) - (perPage - 1);
    const end = (page * perPage);
    try {
        const products = await executeQuery<IProduct[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `select * from (
                        SELECT id,nombre,descripcion,imagenes,stock,codigo,medida,precio,valor,estado,color,img, tipo, ROW_NUMBER() OVER (ORDER BY id) AS RowNum FROM Productos WHERE estado = 1 
                        ) as Result WHERE RowNum BETWEEN ${start} AND ${end} ;`
        );
        

        const total = await executeQuery<[]>(
            process.env.DB_DATABASE_AUXILIAR||"", 
            `SELECT id FROM Productos WHERE estado = 1`
        );        
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(total.length / perPage); i++) {
            pageNumbers.push(i);
        }

        return {
            products : products as IProduct[],
            pageNumbers
        }
    } catch (error) {
        console.error("Error fetching getProductos:");
        console.error(JSON.stringify(error));
        throw error;
    }
}

export async function getProducto(id: number): Promise<IProduct> {
    try {
     const productos = await executeQuery<IProduct[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id,nombre,descripcion,imagenes,stock,codigo,medida,precio,valor,estado,color,img, tipo FROM Productos WHERE id = ${id}`
    );
     return productos[0] as IProduct;
    } catch (error) {
        console.error("Error fetching getProducto:");
        console.error(JSON.stringify(error));
        throw error;
    }
}

export async function getProductoPorCodigo(codigo: string): Promise<IProduct> {
    try {
     const productos = await executeQuery<IProduct[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id,nombre,descripcion,imagenes,stock,codigo,medida,precio,valor,estado,color,img, tipo FROM Productos WHERE codigo = '${codigo}'`
    );
     return productos[0] as IProduct;
    } catch (error) {
        console.error("Error fetching getProducto:");
        console.error(JSON.stringify(error));
        throw error;
    }
}

export async function getProductosLista(): Promise<IProduct[]> {
    try {
     const productos = await executeQuery<IProduct[]>(
        process.env.DB_DATABASE_AUXILIAR||"", 
        `SELECT id,nombre,descripcion,imagenes,stock,codigo,medida,precio,valor,estado,color,img, tipo FROM Productos WHERE estado = 1`
    );
     return productos as IProduct[];
    } catch (error) {
        console.error("Error fetching getProductosLista:");
        console.error(JSON.stringify(error));
        throw error;
    }
}