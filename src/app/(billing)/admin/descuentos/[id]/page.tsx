"use server";
import { getDescuento, getProductosLista } from '@/actions';
import { initialDescuentoForm } from "@/utils";
import { DescuentosForm } from "./DescuentoForm";

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
    let descuento = await getDescuento(+id);

    if ( !descuento ) {
        descuento = initialDescuentoForm;
    }
    const productos = await getProductosLista();
    return (
        <DescuentosForm descuento={descuento} productos={productos}/>
    );
}