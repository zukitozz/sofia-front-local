"use server";

import { getGasto } from "@/actions/gastos";
import { initialGastoForm } from "@/utils/states";
import { GastosForm } from "./GastosForm";

interface Props {
  params: {
    id: string;
  };
}

export default async function GastoIdPage({ params }: Readonly<Props>) {
    const { id } = params;
    let gasto = await getGasto(+id);

    if ( !gasto ) {
        gasto = initialGastoForm;
    }

    return (
        <GastosForm gasto={gasto}/>
    );
}