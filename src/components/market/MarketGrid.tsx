'use client';

import { useState } from 'react';
import { getProductos } from '@/actions';
import { IProduct } from '@/interfaces';
import useSWR from 'swr';
import { MarketItem } from './MarketItem';
import { Constants } from '@/utils/constants';

// El fetcher recibe los argumentos desde la clave de SWR
const fetcher = ([_, page, perPage, keyword]: [string, number, number, string]) => 
    getProductos(page, perPage, keyword);

interface Props {
    tipo_usuario: string;
}

export const MarketGrid = ({ tipo_usuario }: Props) => {
    // Estado para controlar la búsqueda por palabra clave
    const [keyword, setKeyword] = useState('');

    // Pasamos el estado 'keyword' dentro del array de SWR para que se reactive al escribir
    const { data, error, isLoading } = useSWR(
        ['/api/productos', 1, 100, keyword], 
        fetcher
    );

    // El filtro por rol se mantiene igual
    let filtro: string | null = null;
    if (tipo_usuario === Constants.ROL.USER_ROLE) {
        filtro = Constants.AMBITO_PRODUCTOS.ISLA;
    }

    let productos: IProduct[] = [];
    if (Array.isArray(data?.products)) {
        productos = data.products;
        if (filtro) {
            productos = data.products.filter((producto: IProduct) => producto.tipo === Constants.AMBITO_PRODUCTOS.ISLA);
        }
    }

    let content: JSX.Element | null = null;
    if (isLoading) {
        content = (
            <div className="flex justify-center items-center my-10">
                <div className="animate-spin rounded-full h-8 w-8 border-gray-900 border-b-2"></div>
            </div>
        );
    } else if (error || !data || !Array.isArray(data.products)) {
        content = <p className="text-center text-red-500 my-10">Error al cargar los productos.</p>;
    } else if (productos.length === 0) {
        content = <p className="text-center text-gray-500 my-10">No se encontraron productos.</p>;
    } else {
        content = (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-10">
                {productos.map((producto: IProduct) => (
                    <MarketItem
                        key={producto.id}
                        producto={producto}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Contenedor del Input de Filtro */}
            <div className="flex justify-start max-w-md">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
                    />
                    {keyword && (
                        <button 
                            onClick={() => setKeyword('')}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            ---

            {/* Zona de contenido: Carga, Error o Grilla */}
            {content}
        </div>
    );
};