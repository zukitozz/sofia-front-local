"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBack, IoCheckmarkCircle, IoCloseCircle, IoTrashOutline } from "react-icons/io5";

import { Title } from "@/components";
import { saveProducto } from '@/actions';
import { ICodigoBarras, IProduct } from '@/interfaces';
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

const tipos = [
  { id: "VENTA_ISLA", value: "Isla y Administradores" },
  { id: "VENTA_TOTAL", value: "Solo Administradores" }
];

export const ProductForm = ({ product }: Props) => {
    const router = useRouter();
    const isNewProduct = product.id == 0;

    const [formValues, setFormValues] = useState<IProduct>({
        ...product,
        codigosBarras: product.codigosBarras || []
    });
    
    const [nuevoCodigo, setNuevoCodigo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // 1. NUEVO ESTADO: Controla si la imagen se está subiendo
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = target;
        setFormValues({
          ...formValues,
          [name]: name === 'precio' ? Number(value) : value
        });
    };    

    const handleAddCodigo = () => {
        const codigoLimpio = nuevoCodigo.trim();
        if (!codigoLimpio) return;

        const existe = formValues.codigosBarras?.some(c => c.codigo_barras === codigoLimpio);
        if (existe) {
            return alert('Este código de barras ya está asignado a este producto.');
        }

        const nuevoItem: ICodigoBarras = {
            codigo_barras: codigoLimpio,
            estado: 1 
        };

        setFormValues({
            ...formValues,
            codigosBarras: [...(formValues.codigosBarras || []), nuevoItem]
        });
        setNuevoCodigo(''); 
    };

    const handleToggleEstadoCodigo = (index: number) => {
        if (!formValues.codigosBarras) return;
        
        const copiaCodigos = [...formValues.codigosBarras];
        copiaCodigos[index].estado = copiaCodigos[index].estado === 1 ? 0 : 1;

        setFormValues({
            ...formValues,
            codigosBarras: copiaCodigos
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // 2. Bloqueo de seguridad en el submit
        if (isUploadingImage) return alert('Por favor, espera a que termine de cargarse la imagen.');
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
                disabled={(!isNewProduct && isLoading) || isUploadingImage}
                onChange={onInputChange}
                required
              />
            </div>

            <div className='flex flex-col'>
              <label className="font-semibold mb-1" htmlFor="descripcion">Descripción</label>
              <input
                id="descripcion"
                name="descripcion"
                type="text"
                className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500"
                value={formValues.descripcion}
                disabled={isUploadingImage}
                onChange={onInputChange}
              />
            </div>

            <div className='flex flex-col'>
              <label className="font-semibold mb-1" htmlFor="medida">Unidad de Medida</label>
              <select 
                id="medida"
                name="medida" 
                className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500"
                value={formValues.medida}
                disabled={isUploadingImage}
                onChange={onInputChange}
                required
              >
                <option value="">Seleccione</option>
                {medidas.map(item => (
                  <option key={item.id} value={item.id}>{item.value}</option>
                ))}
              </select>
            </div>

            <div className='flex flex-col'>
              <label className="font-semibold mb-1" htmlFor="precio">Precio</label>
              <input
                id="precio"
                name="precio"
                type="number"
                step="0.01"
                className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500"
                value={formValues.precio}
                disabled={isUploadingImage}
                onChange={onInputChange}
                required
              />
            </div>

            <div className='flex flex-col'>
              <label className="font-semibold mb-1" htmlFor="tipo">Tipo de Producto</label>
              <select 
                id="tipo"
                name="tipo" 
                className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500"
                value={formValues.tipo}
                disabled={isUploadingImage}
                onChange={onInputChange}
                required
              >
                <option value="">Seleccione</option>
                {tipos.map(item => (
                  <option key={item.id} value={item.id}>{item.value}</option>
                ))}
              </select>
            </div>

            <UploadButton
              endpoint="imageUploader"
              appearance={{
                container: "flex flex-col items-start gap-2 w-full",
                button: ({ ready, isUploading }) => `
                  w-full px-5 py-2 text-sm font-semibold rounded shadow-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  ${ready 
                    ? "bg-slate-800 text-white hover:bg-slate-700 cursor-pointer border-slate-800" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-200"}
                  ${isUploading ? "bg-blue-600 animate-pulse text-white border-blue-600" : ""}
                `,
                allowedContent: "text-xs text-slate-500 font-medium mt-1",
              }}
              content={{
                button({ ready, isUploading }) {
                  if (isUploading) return "Subiendo imagen...";
                  if (ready) return "Seleccionar Imagen";
                  return "Cargando motor...";
                },
                allowedContent: "Imágenes de hasta 4MB",
              }}
              // 3. EVENTO DE INICIO: Se activa al empezar a subir la imagen
              onUploadBegin={() => {
                setIsUploadingImage(true);
              }}
              onClientUploadComplete={(res) => {
                setIsUploadingImage(false); // Liberamos el estado
                if (res && res[0]) {
                  setFormValues({
                    ...formValues,
                    img: res[0].ufsUrl
                  });
                }
                notify({ message: "Imagen subida con éxito" });
              }}
              onUploadError={(error: Error) => {
                setIsUploadingImage(false); // Liberamos el estado si falla
                notify({ message: `Error al subir: ${error.message}`, type: "error" });
              }}
            />

            <div className="sm:col-span-2 border-t pt-4 mt-2">
              <h3 className="font-bold text-lg mb-2 text-gray-700">Administración de Códigos de Barras</h3>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Escanee o escriba un código de barras..."
                  className="flex-1 px-4 py-2 border rounded focus:outline-blue-500"
                  value={nuevoCodigo}
                  disabled={isUploadingImage}
                  onChange={(e) => setNuevoCodigo(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); 
                      handleAddCodigo();
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={isUploadingImage}
                  onClick={handleAddCodigo}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  Agregar
                </button>
              </div>

              <div className="bg-gray-50 rounded p-3 border min-h-[100px]">
                {formValues.codigosBarras && formValues.codigosBarras.length > 0 ? (
                  <div className="space-y-2">
                    {formValues.codigosBarras.map((item, index) => (
                      <div 
                        key={item.id || index} 
                        className={`flex justify-between items-center p-2 rounded border bg-white ${item.estado === 0 ? 'bg-red-50 border-red-200' : 'border-gray-200'}`}
                      >
                        <div className="flex flex-col">
                          <span className={`font-mono text-sm ${item.estado === 0 ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {item.codigo_barras}
                          </span>
                          <span className={`text-xs font-bold ${item.estado === 1 ? 'text-green-600' : 'text-red-500'}`}>
                            {item.estado === 1 ? 'Activo' : 'Inactivo / Dado de baja'}
                          </span>
                        </div>
                        
                        <button
                          type="button"
                          disabled={isUploadingImage}
                          onClick={() => handleToggleEstadoCodigo(index)}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50 ${
                            item.estado === 1 
                              ? 'text-red-600 border-red-200 hover:bg-red-100' 
                              : 'text-green-600 border-green-200 hover:bg-green-100'
                          }`}
                          title={item.estado === 1 ? "Dar de baja" : "Dar de alta"}
                        >
                          {item.estado === 1 ? (
                            <>
                              <IoCloseCircle size={16} />
                              <span>Dar de baja</span>
                            </>
                          ) : (
                            <>
                              <IoCheckmarkCircle size={16} />
                              <span>Activar</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-6">No hay códigos de barras asociados a este producto.</p>
                )}
              </div>
            </div>

            {/* 4. ACTUALIZACIÓN DEL BOTÓN DE ENVÍO */}
            <div className="sm:col-span-2">
              <button 
                type="submit" 
                disabled={isLoading || isUploadingImage}
                className={`${(isLoading || isUploadingImage) ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'} px-5 py-3 mt-4 w-full text-white font-bold rounded transition-colors`}
              >
                {isUploadingImage 
                  ? 'Subiendo imagen... Por favor espere' 
                  : isLoading 
                    ? 'Guardando...' 
                    : (isNewProduct ? 'Crear Producto' : 'Actualizar Producto')
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}