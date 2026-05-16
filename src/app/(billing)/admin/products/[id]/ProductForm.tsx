"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

import { Title } from "@/components";
import { saveProducto } from '@/actions';
import { IProduct } from '@/interfaces';
import { notify } from "@/utils";
import { UploadButton } from '@/utils/uploadthing';

interface Props {
  product: IProduct;
}

const medidas = [
  { id: "GLL", value: "Galones" },
  { id: "NIU", value: "Unidades" },
  { id: "LTR", value: "Litros" }
];

export const ProductForm = ({ product }: Props) => {
    const router = useRouter();
    const isNewProduct = product.id==0;

    const [formValues, setFormValues] = useState<IProduct>(product);
    const [isLoading, setIsLoading] = useState(false);

    const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = target;
        
        setFormValues({
        ...formValues,
        [name]: name === 'precio' ? Number(value) : value
        });
    };    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // Validación simple
        if (formValues.nombre.trim().length < 2) return alert('Nombre no válido');
        if (formValues.precio <= 0) return alert('El precio debe ser mayor a 0');

        setIsLoading(true);

        try {
            const { status, message } = await saveProducto(formValues);
            
            if (!status) {
                notify({ message: message || "Error al guardar", type: "error" });
                setIsLoading(false);
                return;
            }
            notify({ message: isNewProduct ? "Producto registrado" : "Producto actualizado" });
            router.replace('/admin/products');
            router.refresh();
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={isNewProduct ? 'Creación de producto' : 'Modificación de producto'} />

        <Link
          href="/admin/products/"
          className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
        >
          <IoArrowBack size={30} />
          <span className="ml-3 text-xl">Regresar</span>
        </Link>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className='flex flex-col'>
              <label className="font-semibold mb-1" htmlFor="nombre">Nombre del Producto</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500"
                value={formValues.nombre}
                disabled={!isNewProduct && isLoading}
                onChange={onInputChange}
                required
              />
            </div>

            {/* Campo: Descripción */}
            <div className='flex flex-col'>
              <label className="font-semibold mb-1" htmlFor="descripcion">Descripción</label>
              <input
                id="descripcion"
                name="descripcion"
                type="text"
                className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500"
                value={formValues.descripcion}
                onChange={onInputChange}
              />
            </div>

            {/* Campo: Medida */}
            <div className='flex flex-col'>
              <label className="font-semibold mb-1" htmlFor="medida">Unidad de Medida</label>
              <select 
                id="medida"
                name="medida" 
                className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500"
                value={formValues.medida}
                onChange={onInputChange}
                required
              >
                <option value="">Seleccione</option>
                {medidas.map(item => (
                  <option key={item.id} value={item.id}>{item.value}</option>
                ))}
              </select>
            </div>

            {/* Campo: Precio */}
            <div className='flex flex-col'>
              <label className="font-semibold mb-1" htmlFor="precio">Precio</label>
              <input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500"
                value={formValues.precio}
                onChange={onInputChange}
                required
              />
            </div>
            <UploadButton
              endpoint="imageUploader"
              appearance={{
                // Contenedor general del botón
                container: "flex flex-col items-start gap-2 w-full",
                
                // El botón interactivo principal
                button: ({ ready, isUploading }) => `
                  w-full px-5 py-2 text-sm font-semibold rounded shadow-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${ready 
                    ? "bg-slate-800 text-white hover:bg-slate-700 cursor-pointer border-slate-800" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-200"}
                  ${isUploading ? "bg-blue-600 animate-pulse text-white border-blue-600" : ""}
                `,
                
                // Texto informativo debajo del botón (ej: "Acepta imágenes de hasta 4MB")
                allowedContent: "text-xs text-slate-500 font-medium mt-1",
              }}
              content={{
                // Puedes personalizar el texto de los estados internos si lo deseas
                button({ ready, isUploading }) {
                  if (isUploading) return "Subiendo imagen...";
                  if (ready) return "Seleccionar Imagen";
                  return "Cargando motor...";
                },
                allowedContent: "Imágenes de hasta 4MB",
              }}
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                // Tip Senior: Aquí deberías actualizar tu estado dinámico para guardar la URL en el formulario
                if (res && res[0]) {
                  setFormValues({
                    ...formValues,
                    img: res[0].ufsUrl // O el campo exacto que devuelva tu configuración
                  });
                }
                notify({ message: "Imagen subida con éxito" });
              }}
              onUploadError={(error: Error) => {
                notify({ message: `Error al subir: ${error.message}`, type: "error" });
              }}
            />

            {/* Botón de envío */}
            <div className="sm:col-span-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`${isLoading ? 'bg-gray-400' : 'btn-primary'} px-5 py-3 mt-4 w-full text-white font-bold rounded transition-colors`}
              >
                {isLoading 
                  ? 'Guardando...' 
                  : (isNewProduct ? 'Crear Producto' : 'Actualizar Producto')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}