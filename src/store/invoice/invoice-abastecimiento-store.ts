import { IAbastecimiento, IFuelProduct, IOrderItem, IProduct } from "@/interfaces";
import { Constants } from "@/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getDescuentosByNumeroDocumento } from '@/actions';

interface State {
    items: IOrderItem[];
    getTotalItems: () => number;
    addAbastecimientoToOrder: (item: IAbastecimiento ) => void;
    updateProductQuantity: (product: IOrderItem, quantity: number) => void;
    addProductToOrder: (product: IProduct ) => void;
    getSummaryInformation: () => { subTotal: number; totalIgv: number; total: number };
    removeProduct: (product: IOrderItem) => void;
    applyDiscountIfExists: (numeroDocumento: string) => Promise<void>;
    removeAllProducts: () => void;
}

export const useOrderAbastecimientoStore = create<State>()( 
    persist(
        (set, get) => ({
            items: [],
            getTotalItems: () => {
                const { items } = get();
                let new_cantidad = 0;
                items.forEach(element => {
                    new_cantidad += (element.medida === "GLL") ? 1 : element.cantidad;
                });
                return new_cantidad;
            },              
            getSummaryInformation: () => {
                const { items } = get();
                const total = Math.round(items.reduce((total, item) => total + item.precio, 0)*100)/100;
                const subTotal = Math.round((total/(1 + Number.parseFloat(process.env.NEXT_PUBLIC_TAX || "0.18")))*100)/100;
                const totalIgv = Math.round((total - subTotal)*100)/100;
                return { subTotal, totalIgv, total };
            },
            addAbastecimientoToOrder: ({ idAbastecimiento, valorTotal, volTotal, codigoCombustible, precioUnitario ,pistola, tiempo, fechaHora, totInicio, totFinal }: IAbastecimiento) => {
                const fuelConfigString = process.env.NEXT_PUBLIC_FUEL_CONFIG;
                const FUEL_CONFIG: IFuelProduct[] = fuelConfigString ? JSON.parse(fuelConfigString) : [];
                const taxRate = Number.parseFloat(process.env.NEXT_PUBLIC_TAX || "0.18");
                const orderItem: IOrderItem = {
                    cantidad: volTotal,
                    precio: valorTotal,
                    valor: Math.round((valorTotal/(1 + taxRate))*10000000000)/10000000000,
                    igv: Math.round((valorTotal - valorTotal/(1 + taxRate))*100)/100,
                    valor_unitario: Math.round((precioUnitario/(1 + taxRate))*10000000000)/10000000000,
                    precio_unitario: precioUnitario,
                    descripcion: FUEL_CONFIG.find(fuel => fuel.id === codigoCombustible)?.desc || "Combustible",
                    codigo_producto: FUEL_CONFIG.find(fuel => fuel.id === codigoCombustible)?.id_auxiliar || "",
                    medida: Constants.MEDIDA.GALON,
                    id_abastecimiento: idAbastecimiento ?? null,
                    pistola: pistola,
                    tiempo_abastecimiento: tiempo,
                    fecha_abastecimiento: fechaHora,
                    total_inicio: totInicio,
                    total_final: totFinal
                }
                set({ items: [orderItem] });

            },
            addProductToOrder: (product: IProduct) => {
                const { items } = get();
                const productInOrder = items.some(item => item.codigo_producto === product.codigo);
                const taxRate = Number.parseFloat(process.env.NEXT_PUBLIC_TAX || "0.18");
                const productItem: IOrderItem = {
                    cantidad: 1,
                    precio: product.precio,
                    valor: product.valor,
                    igv: product.valor * taxRate,
                    valor_unitario: product.valor,
                    precio_unitario: product.precio,
                    descripcion: product.nombre,
                    codigo_producto: product.codigo,
                    medida: product.medida,
                    img: product.img
                }                
                if(!productInOrder){
                    set({ items: [...items, productItem] });
                    return;
                }
                const updatedItems = items.map(item => {
                    if(item.codigo_producto === productItem.codigo_producto){
                        const updatedCantidad = item.cantidad + productItem.cantidad;
                        const updatedValor = Math.round((item.valor + productItem.valor)*10000000000)/10000000000;
                        const updatedIgv = Math.round((item.igv + productItem.igv)*100)/100;
                        const updatedPrecio = Math.round((item.precio + productItem.precio)*100)/100;
                        return { ...item, cantidad: updatedCantidad, valor: updatedValor, igv: updatedIgv, precio: updatedPrecio };
                    }
                    return item;
                });
                set({ items: updatedItems });
            },
            updateProductQuantity: (product: IOrderItem, quantity: number) => {
                const { items } = get();
                const updatedItems = items.map((item) => {
                    if (item.codigo_producto === product.codigo_producto) {
                        const precio = Math.round((item.precio_unitario * quantity)*100)/100;
                        const valor = Math.round((item.valor_unitario * quantity)*10000000000)/10000000000;
                        const igv = Math.round((precio - valor)*100)/100;
                        return { 
                            ...item, precio, valor, igv, cantidad: quantity
                        };
                    }
                    return item;
                });
                set({ items: updatedItems });
            },
            removeProduct: (product: IOrderItem) => {
                const { items } = get();
                const updatedItems = items.filter(
                (item) => item.codigo_producto !== product.codigo_producto
                );

                set({ items: updatedItems });
            },
            applyDiscountIfExists: async (numeroDocumento: string) => {
                if(!numeroDocumento) return;
                const descuentos = await getDescuentosByNumeroDocumento(numeroDocumento);
                const { items } = get();
                const updatedItems = items.map((item) => {
                    const descuento = descuentos.find(desc => desc.codigo_producto === item.codigo_producto);
                    if(descuento){
                        const taxRate = Number.parseFloat(process.env.NEXT_PUBLIC_TAX || "0.18");
                        const precioConDescuento = Math.round((item.precio - descuento.monto_descuento)*100)/100;
                        const valorConDescuento = Math.round((precioConDescuento/(1 + taxRate))*10000000000)/10000000000;
                        const igvConDescuento = Math.round((precioConDescuento - valorConDescuento)*100)/100;
                        const valorUnitarioConDescuento = Math.round((item.valor_unitario - (descuento.monto_descuento/item.cantidad))*10000000000)/10000000000;
                        const precioUnitarioConDescuento = Math.round((valorUnitarioConDescuento*(1 + taxRate))*10000000000)/10000000000;
                        return { ...item, precio: precioConDescuento, valor: valorConDescuento, igv: igvConDescuento, valor_unitario: valorUnitarioConDescuento, precio_unitario: precioUnitarioConDescuento };
                    }
                    return item;
                });
                set({ items: updatedItems });                
            },
            removeAllProducts: () => {
                set({ items: [] });
            },
        }),
        {
            name: 'order-abastecimiento-store',
        }
    )
)