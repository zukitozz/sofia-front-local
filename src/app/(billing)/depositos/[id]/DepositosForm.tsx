
"use client";
import { Title } from "@/components";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { IDepositos } from "@/interfaces"
import { saveDeposito } from "@/actions";
import { useSession } from "next-auth/react";
import { toLocaleStorage } from "@/utils";

interface Props {
  deposito: IDepositos
}

export const DepositosForm = ({ deposito }: Props) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [formValues, setFormValues] = useState<IDepositos>(deposito);
    const newProduct = deposito.id==0;
    const handleChangeConcepto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, concepto: event.target.value });
    };
    const handleChangeMonto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, monto: +event.target.value });
    };

    const handlerProcessDeposito = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const UsuarioId: number = session?.user?.id ? +session.user.id : 0;
        const deposito: IDepositos = {
            id: formValues.id,
            concepto: formValues.concepto,
            monto: formValues.monto,
            fecha: toLocaleStorage(new Date()),
            turno: session?.user?.jornada || "",
            UsuarioId,
            usuario: session?.user?.id || "",
        }
        await saveDeposito(deposito);
        router.push('/depositos')
    }

    return(
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
            <Title title={ newProduct? 'Registro de depósito':'Modificación de depósito' } />
            <Link
              href="/depositos/"
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoArrowBack size={30} />
              <span className="ml-3 text-xl">Regresar</span>
            </Link>
            <br/>
            <form onSubmit={handlerProcessDeposito} autoComplete="off" className="flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                    <div className='col-span-1'>
                        <label htmlFor="concepto">Concepto</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="concepto"
                            defaultValue={ deposito?.concepto }
                            onChange={ handleChangeConcepto }
                        />
                    </div> 
                    <div className='col-span-1'>
                        <label htmlFor="monto">Monto</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="monto" 
                            defaultValue={ deposito?.monto }
                            onChange={ handleChangeMonto }
                        />
                    </div>
                    <div className="col-span-2">
                        <button className={`btn-primary px-5 py-2 mt-3 w-full`} disabled={false} type="submit">
                            { newProduct?'Registrar depósito':'Editar depósito'}
                        </button>                        
                    </div>                    
                </div>
            </form>
        </div>
      </div>        
    )
}