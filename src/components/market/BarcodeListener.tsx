"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOrderAbastecimientoStore } from "@/store";
import { getProductosPorCodigoBarra } from "@/actions";
import { notify } from "@/utils";

export const BarcodeListener = () => {
  const router = useRouter();
  const addProductToOrder = useOrderAbastecimientoStore((state) => state.addProductToOrder);

  // Usamos un ref para acumular los caracteres del código de barras sin provocar re-renders
  const bufferRef = useRef<string>("");

  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // Si presiona Enter, significa que la pistola terminó de escanear
      if (event.key === "Enter") {
        const barcode = bufferRef.current.trim();
        
        if (barcode.length > 0) {
          // Evitamos que el "Enter" envíe formularios por defecto si los hubiera
          event.preventDefault(); 

          const { producto, message, status } = await getProductosPorCodigoBarra(barcode);
          console.log("Producto encontrado:", producto);
          if (status && producto) {
            addProductToOrder(producto);
            notify({ message: `Producto agregado: ${producto.nombre}`, type: "success" });
          } else {
            notify({ message: message, type: "error" });
          }
          
          
          // AQUÍ LA LÓGICA DE REDIRECCIÓN:
          // Opción A: Redirigir a una ruta de procesamiento para que agregue al carrito directamente
          //router.push(`/api/cart/add?code=${barcode}`);
          
          // Opción B: Si tu carrito maneja los productos mediante URL o ID en el cliente
          // router.push(`/cart?search=${barcode}`);
        }
        
        // Limpiamos el buffer para el siguiente escaneo
        bufferRef.current = "";
        return;
      }

      // Ignorar teclas de control como Shift, Alt, etc.
      if (event.key.length === 1) {
        bufferRef.current += event.key;
      }
    };

    // Escuchamos el teclado en todo el documento
    window.addEventListener("keydown", handleKeyDown);

    // Limpiamos el evento cuando el componente se desmonte
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return null; // Este componente es invisible
};