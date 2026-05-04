"use client";
import { Title } from "@/components";
import { saveDescuento, getReceptorByDocumento } from '@/actions';
import { useState } from 'react';
import { IDescuentoTable, IProduct } from '@/interfaces';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

interface Props {
  descuento: IDescuentoTable
  productos: IProduct[]
}

export const DescuentosForm = ({ descuento, productos }: Props) => {
    const router = useRouter();
    const [formValues, setFormValues] = useState<IDescuentoTable>(descuento);
    const newProduct = descuento.id==0;
    const handleChangeMonto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, monto_descuento: +event.target.value });
    };
    const handleChangeRuc = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, numero_documento: event.target.value });
    };
    const handleChangeProducto = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormValues({ ...formValues, codigo_producto: event.target.value });
    };
    const handleChangeEstado = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormValues({ ...formValues, estado: +event.target.value });
    };
    const handleKeyNumeroDocumento = async (event: { key: string; preventDefault: () => void; }) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const receptor = await getReceptorByDocumento(formValues.numero_documento);
            if(receptor){
                setFormValues({ ...formValues,  cliente: receptor.razon_social });
            }else{
                setFormValues({ ...formValues, cliente: '' });
            }
        }
    };    
    const handlerProcessBilling = async (event: React.FormEvent<HTMLFormElement>) => {
        //TODO: Validar
        event.preventDefault();
        await saveDescuento(formValues);
        router.push('/admin/descuentos')
    }

    return (
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
            <Title title={ newProduct? 'Creación del descuento':'Modificación del descuento' } />
            <Link
              href="/admin/descuentos/"
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoArrowBack size={30} />
              <span className="ml-3 text-xl">Regresar</span>
            </Link>
            <br/>
            <form onSubmit={handlerProcessBilling} autoComplete="off" className="flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                    <div className='col-span-1'>
                        <label htmlFor="nomnbre">Cliente documento</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="nomnbre"
                            defaultValue={ descuento?.numero_documento }
                            disabled = { !newProduct } 
                            onChange={ handleChangeRuc }
                            onKeyDown={ handleKeyNumeroDocumento }
                        />
                    </div> 
                    <div className='col-span-1'>
                        <label htmlFor="descripcion">Cliente nombre</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="descripcion" 
                            value={ formValues.cliente }
                            disabled = { true } 
                        />
                    </div>
                    <div className='col-span-1'>
                        <label htmlFor="medida">Producto</label>
                        <select name="medida" className="px-5 py-2 border bg-gray-200 rounded w-full" onChange={ handleChangeProducto } defaultValue={descuento?.codigo_producto} disabled = { !newProduct }>
                            <option value={''}>Seleccione</option>
                            {
                                productos.map(item=> (<option key={item.id} value={item.codigo}>{item.nombre}</option>))
                            }
                        </select>
                    </div> 
                    <div className='col-span-1'>
                        <label htmlFor="placa">Precio</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="placa" 
                            defaultValue={ descuento?.monto_descuento } 
                            onChange={ handleChangeMonto }
                        />
                    </div>
                    <div className='col-span-1'>
                        <label htmlFor="medida">Estado</label>
                        <select name="medida" className="px-5 py-2 border bg-gray-200 rounded w-full" onChange={ handleChangeEstado } defaultValue={descuento?.estado}>
                            <option value={''}>Seleccione</option>
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                        </select>
                    </div>                     
                    <div className="col-span-2">
                        <button className={`btn-primary px-5 py-2 mt-3 w-full`} disabled={false} type="submit">
                            { newProduct?'Crear descuento':'Editar descuento'}
                        </button>                        
                    </div>                    
                </div>
            </form>
        </div>
      </div>
    );
}