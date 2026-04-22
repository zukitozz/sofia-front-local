
"use client";
import { Title } from "@/components";
import Link from "next/link";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { IGastos } from "@/interfaces"
import { saveGasto } from "@/actions";
import { useSession } from "next-auth/react";
import { toLocaleStorage } from "@/utils";

interface Props {
  gasto: IGastos
}

export const GastosForm = ({ gasto }: Props) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [formValues, setFormValues] = useState<IGastos>(gasto);
    const newProduct = gasto.id==0;
    const handleChangeConcepto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, concepto: event.target.value });
    };
    const handleChangeMonto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, monto: +event.target.value });
    };
    const handleChangeAutorizado = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, autorizado: event.target.value });
    }

    const handlerProcessGasto = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const UsuarioId: number = session?.user?.id ? +session.user.id : 0;
        const gasto: IGastos = {
            id: formValues.id,
            concepto: formValues.concepto,
            monto: formValues.monto,
            fecha: toLocaleStorage(new Date()),
            usuario_gasto: session?.user?.usuario || "",
            turno: session?.user?.jornada || "",
            autorizado: formValues.autorizado,
            UsuarioId
        }
        await saveGasto(gasto);
        router.push('/gastos')
    }

    return(
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
            <Title title={ newProduct? 'Registro de gasto':'Modificación de gasto' } />
            <Link
              href="/gastos/"
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoArrowBack size={30} />
              <span className="ml-3 text-xl">Regresar</span>
            </Link>
            <br/>
            <form onSubmit={handlerProcessGasto} autoComplete="off" className="flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                    <div className='col-span-1'>
                        <label htmlFor="concepto">Concepto</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="concepto"
                            defaultValue={ gasto?.concepto }
                            onChange={ handleChangeConcepto }
                        />
                    </div> 
                    <div className='col-span-1'>
                        <label htmlFor="monto">Monto</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="monto" 
                            defaultValue={ gasto?.monto }
                            onChange={ handleChangeMonto }
                        />
                    </div>
                     <div className='col-span-1'>
                        <label htmlFor="autorizado">Autorizado</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="autorizado"  
                            defaultValue={ gasto?.autorizado }
                            onChange={ handleChangeAutorizado }
                        />
                    </div>
                    <div className="col-span-2">
                        <button className={`btn-primary px-5 py-2 mt-3 w-full`} disabled={false} type="submit">
                            { newProduct?'Registrar gasto':'Editar gasto'}
                        </button>                        
                    </div>                    
                </div>
            </form>
        </div>
      </div>        
    )
}