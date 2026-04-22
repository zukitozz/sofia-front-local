'use client';
import { IAbastecimiento } from "@/interfaces"
import { AbastecimientoGridItem } from "./AbastecimientoGridItem"
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AbastecimientoGrid = () => {
    const { data } = useSWR<IAbastecimiento[]>(`${process.env.NEXT_PUBLIC_URL}/api/abastecimientos`, (url: string) => fetcher(url));
    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-10">
            {
                data?.map( abastecimiento => (
                    <AbastecimientoGridItem
                        key={ abastecimiento.idAbastecimiento }
                        abastecimiento={ abastecimiento }
                    />
                ) )
            }
        </div>
    )
}
