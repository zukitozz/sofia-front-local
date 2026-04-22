import { IAbastecimiento, IFuelProduct, IOrderItem } from "@/interfaces";
import { Constants } from "@/utils/constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: IOrderItem[];
    getTotalItems: () => number;
    addProductToOrder: (item: IOrderItem) => void;
    addAbastecimientoToOrder: (item: IAbastecimiento) => void;
    updateProductQuantity: (product: IOrderItem, quantity: number) => void;
    getSummaryInformation: () => { subTotal: number; totalIgv: number; total: number };
    removeProduct: (product: IOrderItem) => void;
}

export const useCartStore = create<State>()( 
    persist(
        (set, get) => ({
            cart: [],
            getTotalItems: () => {
                const { cart } = get();
                const new_cart_quantity = cart.map(item => {
                    item.cantidad = (item.medida === "GLL") ? 1 : item.cantidad;
                    return item;
                });
                return new_cart_quantity.reduce((total, item) => total + item.cantidad, 0);
            },            
            getSummaryInformation: () => {
                const { cart } = get();
                const subTotal = Math.round((cart.reduce( (acc, item) => acc + item.valor, 0))*100) / 100;
                const totalIgv = cart.reduce( (acc, item) => acc + item.igv, 0);
                const total = cart.reduce( (acc, item) => acc + item.precio, 0);
                return { subTotal, totalIgv, total };
            },
            addProductToOrder: (orderItem: IOrderItem) => {
                const { cart } = get();
                const productInOrder = cart.some(item => item.codigo_producto === orderItem.codigo_producto);
                if(!productInOrder){
                    set({ cart: [...cart, orderItem] });
                    return;
                }
                const updatedCart = cart.map(item => {
                    if(item.codigo_producto === orderItem.codigo_producto){
                        const updatedCantidad = item.cantidad + orderItem.cantidad;
                        const updatedValor = Math.round((item.valor + orderItem.valor)*10000000000)/10000000000;
                        const updatedIgv = Math.round((item.igv + orderItem.igv)*100)/100;
                        const updatedPrecio = Math.round((item.precio + orderItem.precio)*100)/100;
                        return { ...item, cantidad: updatedCantidad, valor: updatedValor, igv: updatedIgv, precio: updatedPrecio };
                    }
                    return item;
                });
                set({ cart: updatedCart });
            },
            addAbastecimientoToOrder: ({ idAbastecimiento, valorTotal, volTotal, codigoCombustible, precioUnitario ,pistola, tiempo, fechaHora, totInicio, totFinal }: IAbastecimiento) => {
                const { cart } = get();
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
                const productInOrder = cart.some(item => item.codigo_producto === orderItem.codigo_producto);
                if(!productInOrder){
                    set({ cart: [...cart, orderItem] });
                    return;
                }
                const updatedCart = cart.map(item => {
                    if(item.codigo_producto === orderItem.codigo_producto){
                        const updatedCantidad = item.cantidad + orderItem.cantidad;
                        const updatedValor = Math.round((item.valor + orderItem.valor)*10000000000)/10000000000;
                        const updatedIgv = Math.round((item.igv + orderItem.igv)*100)/100;
                        const updatedPrecio = Math.round((item.precio + orderItem.precio)*100)/100;
                        return { ...item, cantidad: updatedCantidad, valor: updatedValor, igv: updatedIgv, precio: updatedPrecio };
                    }
                    return item;
                });
                set({ cart: updatedCart });                
            },
            updateProductQuantity: (product: IOrderItem, quantity: number) => {
                const { cart } = get();

                const updatedCartProducts = cart.map((item) => {
                if (item.codigo_producto === product.codigo_producto) {
                    return { ...item, quantity: quantity };
                }
                return item;
                });

                set({ cart: updatedCartProducts });
            },
            removeProduct: (product: IOrderItem) => {
                const { cart } = get();
                const updatedCartProducts = cart.filter(
                (item) => item.codigo_producto !== product.codigo_producto
                );

                set({ cart: updatedCartProducts });
            },            
        }),
        {
            name: 'order-abastecimiento-store',
        }
    )
)