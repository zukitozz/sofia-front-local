'use server';
import { IProduct, IProductoStoreResponse } from '@/interfaces';
import { executeQuery, saveCierreTurnoTransaction, saveProductoTransaction } from '@/utils/db';
import { Constants, redondear } from "@/utils";

export async function saveProducto( producto: IProduct): Promise<IProductoStoreResponse> {

    return await saveProductoTransaction(producto);  
}