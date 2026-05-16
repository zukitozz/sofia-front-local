'use client';
import { ProductImage, QuantitySelector } from "@/components";
import { useOrderAbastecimientoStore } from "@/store";
import { currencyFormat } from "@/utils/formats";
import Link from "next/link";
import { useEffect, useState } from "react";


export const ProductsInCart = () => {
    
    const [loaded, setLoaded] = useState(false);
    const productsInCart = useOrderAbastecimientoStore( state => state.items );
    const updateProductQuantity = useOrderAbastecimientoStore( state => state.updateProductQuantity );
    const removeProduct = useOrderAbastecimientoStore( state => state.removeProduct );

    useEffect(() => {
        setLoaded(true) ;
    });

    if( !loaded ) {
        return <p>Loading...</p>
    }

    return(
        <>
            {
                productsInCart.map( (product) => (
                    <div key={ `${ product.codigo_producto }`  } className="flex mb-5">
                        <ProductImage
                            src={ product.img }
                            width={100}
                            height={100}
                            alt={product.nombre_producto || product.codigo_producto}
                            className="mr-5 rounded"
                        />
                        <div>
                            <Link 
                            className="hover:underline cursor-pointer"
                            href={ `/product/${ product.codigo_producto } ` }>
                            {product.descripcion}
                            </Link>
                            
                            <p>Precio: {currencyFormat(product.precio_unitario)}</p>
                            {
                                !product.id_abastecimiento && (
                                    <QuantitySelector 
                                    quantity={ product.cantidad } 
                                    type = { product.medida }                                    
                                    onQuantityChanged={ quantity => updateProductQuantity(product, quantity) }
                                    />                                    
                                )
                            }


                            <button 
                            onClick={ () => removeProduct(product) }
                            className="underline mt-3">Remover</button>
                        </div>                        
                    </div>
                ))
            }
        </>
    )

}