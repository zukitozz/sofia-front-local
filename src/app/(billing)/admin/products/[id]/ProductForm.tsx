"use client";
import { Title } from "@/components";
import { saveProducto } from '@/actions';
import { useState } from 'react';
import { IProduct } from '@/interfaces';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

interface Props {
  product: IProduct
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

export const ProductForm = ({ product }: Props) => {
    const router = useRouter();
    const [formValues, setFormValues] = useState<IProduct>(product);
    const newProduct = product.id==0;
    const handleChangePrecio = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, precio: +event.target.value });
    };
    const handleChangeMedida = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFormValues({ ...formValues, medida: event.target.value });
    };
    const handleChangeProducto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, nombre: event.target.value });
    };
    const handleChangeDescripcion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, descripcion: event.target.value });
    };      
    const handlerProcessBilling = async (event: React.FormEvent<HTMLFormElement>) => {
        //TODO: Validar
        event.preventDefault();
        await saveProducto(formValues);
        router.push('/admin/products')
    }

    return (
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
            <Title title={ newProduct? 'Creación de producto':'Modificación de producto' } />
            <Link
              href="/admin/products/"
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoArrowBack size={30} />
              <span className="ml-3 text-xl">Regresar</span>
            </Link>
            <br/>
            <form onSubmit={handlerProcessBilling} autoComplete="off" className="flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                    <div className='col-span-1'>
                        <label htmlFor="nomnbre">Producto</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="nomnbre"
                            defaultValue={ product?.nombre }
                            disabled = { !newProduct } 
                            onChange={ handleChangeProducto }
                        />
                    </div> 
                    <div className='col-span-1'>
                        <label htmlFor="descripcion">Descripción</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="descripcion" 
                            defaultValue={ product?.descripcion }
                            disabled = { !newProduct } 
                            onChange={ handleChangeDescripcion }
                        />
                    </div>
                    <div className='col-span-1'>
                        <label htmlFor="medida">Medida</label>
                        <select name="medida" className="px-5 py-2 border bg-gray-200 rounded w-full" onChange={ handleChangeMedida} defaultValue={product.medida}>
                            <option value={''}>Seleccione</option>
                            {
                                medidas.map(item=> (<option key={item.id} value={item.id}>{item.value}</option>))
                            }
                        </select>
                    </div> 
                    <div className='col-span-1'>
                        <label htmlFor="placa">Precio</label>
                        <input
                            className="px-5 py-2 border bg-gray-200 rounded w-full"
                            type="text"
                            name="placa" 
                            defaultValue={ product?.precio } 
                            onChange={ handleChangePrecio }
                        />
                    </div>
                    <div className="col-span-2">
                        <button className={`btn-primary px-5 py-2 mt-3 w-full`} disabled={false} type="submit">
                            { newProduct?'Crear producto':'Editar producto'}
                        </button>                        
                    </div>                    
                </div>
            </form>
        </div>
      </div>
    );
}