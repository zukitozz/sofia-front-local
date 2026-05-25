'use client';

import { getProductos } from '@/actions';
import { IProduct } from '@/interfaces';
import useSWR from 'swr';
import { MarketItem } from './MarketItem';
import { Constants } from '@/utils/constants';

// Modificamos el fetcher para que reciba los argumentos desde la clave de SWR
const fetcher = ([_, page, perPage, keyword]: [string, number, number, string]) => 
    getProductos(page, perPage, keyword);

interface Props {
    tipo_usuario: string;
}

export const MarketGrid = ({ tipo_usuario }: Props) => {
    // 1. Pasamos los argumentos en un array como clave. 
    // Reducir temporalmente de 100 a 20 o 40 ayudará a ver si el backend es el lento.
    const { data, error, isLoading } = useSWR(
        ['/api/productos', 1, 100, ""], 
        fetcher
    );

    // 2. Quitamos 'isValidating'. Solo mostramos carga si realmente no hay datos (isLoading).
    if (isLoading) {
        return (
            <div className="flex justify-center items-center my-10">
                <div className="animate-spin rounded-full h-8 w-8 border-gray-900 border-b-2"></div>
            </div>
        );
    }   

    if (error || !data || !Array.isArray(data.products)) {
        return <p className="text-center text-red-500">Error al cargar los productos.</p>;
    }

    // 3. El filtrado se mantiene igual
    const productos: IProduct[] = tipo_usuario === Constants.ROL.USER_ROLE 
        ? data.products.filter((producto: IProduct) => producto.medida !== Constants.MEDIDA.GALON) 
        : data.products.filter((producto: IProduct) => producto.medida === Constants.MEDIDA.GALON);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-10">
            {
                productos.map((producto: IProduct) => (
                    <MarketItem
                        key={ producto.id }
                        producto={ producto }
                    />
                ))
            }
        </div>
    );
};