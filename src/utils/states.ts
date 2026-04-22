import { IBillingForm, IDepositos, IDescuentoTable, IGastos, IProduct, IReceptor, IUser } from "@/interfaces";

export const initialBillingForm: IBillingForm = {
    numeroDocumento: '',
    razonSocial: '',
    placa: '',
    direccion: '',
    tipoComprobante: "",
    tipoDocumento: "",
    efectivo: 0,
    tarjeta: 0,
    yape: 0,
}

export const initialProductForm: IProduct = {
    id: 0,
    nombre: "",
    descripcion: "",
    stock: 0,
    codigo: "",
    medida: "",
    precio: 0,
    valor: 0,
    color: "",
    estado: 0,
    img: ""
}

export const initialGastoForm: IGastos = {
    id: 0,
    concepto: "",
    monto: 0,
    usuario_gasto: "",
    autorizado: "",
    turno: "",
    fecha: "",
    UsuarioId: 0
}
export const initialDepositoForm: IDepositos = {
    id: 0,
    concepto: "",
    monto: 0,
    usuario: "",
    turno: "",
    fecha: "",
    UsuarioId: 0
}

export const initialUserForm: IUser = {
    id: 0,
    nombre: "",
    usuario: "",
    correo: "",
    img: "",
    rol: "USER_ROLE",
    estado: 0,
    EmisorId: 0
}

export const initialReceptorForm: IReceptor = {
    id: 0,
    tipo_documento: "",
    numero_documento: "",
    razon_social: "",
    direccion: "",
    placa: ""
}

export const initialDescuentoForm: IDescuentoTable = {
    id: 0,
    codigo_producto: "",
    numero_documento: "",
    monto_descuento: 0,
    tipo: "",
    fecha: "",
    estado: 1,
    descripcion_producto: "",
    cliente: "",
}


