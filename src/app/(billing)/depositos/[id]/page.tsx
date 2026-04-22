"use server";

import { initialDepositoForm } from "@/utils/states";
import { DepositosForm } from "./DepositosForm";
import { getDeposito } from "@/actions";

interface Props {
  params: {
    id: string;
  };
}

export default async function DepositoIdPage({ params }: Readonly<Props>) {
    const { id } = params;
    let deposito = await getDeposito(+id);

    if ( !deposito ) {
        deposito = initialDepositoForm;
    }

    return (
        <DepositosForm deposito={deposito}/>
    );
}