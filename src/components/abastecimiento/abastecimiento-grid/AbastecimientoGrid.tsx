'use client';
import { IAbastecimiento } from "@/interfaces"
import { AbastecimientoGridItem } from "./AbastecimientoGridItem"
import useSWR from 'swr';
import { getAbastecimientos } from "@/actions";
import { Constants } from "@/utils";
import { useOrderAbastecimientoStore } from "@/store";

interface Props{
    pistolas: number[]
}

export const AbastecimientoGrid = ({ pistolas }: Props) => {
  const removeAllProducts = useOrderAbastecimientoStore((state) => state.removeAllProducts);
  removeAllProducts(); // Limpiar productos anteriores al cargar la página    
    const { data } = useSWR<IAbastecimiento[]>(`${process.env.NEXT_PUBLIC_URL}/api/abastecimientos`, 
        () => getAbastecimientos(pistolas, Constants.ESTADOS_ABASTECIMIENTO.PENDIENTE), { 
            refreshInterval: 2000,
            refreshWhenHidden: true,
            refreshWhenOffline: true,
            revalidateOnFocus: true,
        }
    );
    return (
        <>
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
        </>

    )
}
