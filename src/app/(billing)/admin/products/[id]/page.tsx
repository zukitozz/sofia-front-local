"use server";
import { getProducto } from '@/actions';
import { initialProductForm } from "@/utils";
import { ProductForm } from "./ProductForm";

interface Props {
  params: {
    id: string;
  };
}
interface IMedida {
    id: string;
    value: string;
}
const medidas: IMedida[] = [
    { id: "GLL", value:"Galones" },
    { id: "NIU", value:"Unidades" },
    { id: "LTR", value:"Litros" }
];

export default async function ProductIdPage({ params }: Readonly<Props>) {
    const { id } = params;
    let product = await getProducto(+id);

    if ( !product ) {
        product = initialProductForm;
    }

    return (
        <ProductForm product={product}/>
    );
}