'use client';

import { getProductos } from '@/actions';
import { IProduct } from '@/interfaces';
import useSWR from 'swr';
import { MarketItem } from './MarketItem';
import { Constants } from '@/utils/constants';

const fetcher = (page: number, perPage: number, keyword?: string) => getProductos(page, perPage, keyword);

interface Props {
    tipo_usuario: string;
}

export const MarketGrid = ({ tipo_usuario }: Props) => {
    const { data, error, isValidating, isLoading } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api`, () => fetcher(1, 100, ""));

    if(!data || isLoading || isValidating || error || !Array.isArray(data.products)){
        return (<div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>);
    }   

    const productos: IProduct[] = tipo_usuario === Constants.ROL.USER_ROLE ? data.products.filter((producto: IProduct) => producto.medida !== Constants.MEDIDA.GALON) : data.products.filter((producto: IProduct) => producto.medida === Constants.MEDIDA.GALON);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-10">
            {
                productos.map( (producto: IProduct) => (
                    <MarketItem
                        key={ producto.id }
                        producto={ producto }
                    />
                ) )
            }
        </div>
    )
}
