import { ICierreTurnoDetalle, ICierreTurnoSoles, IComprobanteAdmin, IComprobanteAdminItem, IComprobanteHistorico, IDepositos, IGastos } from '@/interfaces';
import EscPosEncoder from '@mexicocss/esc-pos-encoder-ts';
import { currencyFormat, toLocaleShow } from './formats';
import { Constants } from './constants';

export const generarTicketHistorico = (factura: IComprobanteHistorico): Uint8Array => {
    const encoder = new EscPosEncoder();
    // Inicializar el encoder
    let result = encoder.initialize();
    //20100100100|03|B001|00990227|0.6|3.91|2026-04-24|0|42187637|BVKe+moPworj5JBhyHkj8Dgl1YY=
    const ruc = process.env.NEXT_PUBLIC_RS||"" 
    const hash = `${ruc}|${factura.numeracion_comprobante}|${factura.igv}|${factura.total}|${factura.Receptor.tipo_documento}|${factura.Receptor.numero_documento}`

    // --- CABECERA ---
    result
        .codepage('cp858') 
        .align('center')
        .line(`${ruc}`) // Nombre fijo o sacado de otro lugar
        .line(`RUC: ${factura.ruc}`)               // Tu RUC emisor
        .line(process.env.NEXT_PUBLIC_EMISOR_DIR||"")
        .newline()
        .bold(true)
        .line(`${factura.tipo_comprobante.toUpperCase()}`)
        .line(`${factura.numeracion_comprobante}`)
        .bold(false)
        .newline();

    // --- DATOS DEL CLIENTE ---
    result
        .align('left')
        .line(`FECHA:\t${toLocaleShow(factura.fecha_hora)}`)
        .line(`CLIEN:\t${factura.Receptor.razon_social || 'PÚBLICO GENERAL'}`)
        .line(`DOCUM:\t${factura.Receptor.numero_documento || '0'}`)
        .line(`PLACA:\t${factura.Receptor.placa || '---'}`)
        .line('---------------------------------------')
        .line(`CANT\tDESCRIPCION\tP.UNIT\tTOTAL`)
        .line('---------------------------------------');

    // --- DETALLE DE PRODUCTOS ---
    factura.items?.forEach((item: IComprobanteAdminItem) => {
        // Formateamos para que las columnas queden alineadas
        // Ejemplo: 10.50 GL  GASOHOL 95  16.50  173.25
        const cantidad = item.cantidad_venta.toFixed(3);
        const descripcion = item.descripcion.substring(0, 15).padEnd(15, ' ');
        const precio = item.precio.toFixed(2);
        const total = item.precio_venta.toFixed(2);

        result.line(`${cantidad}\t${descripcion}\t${precio}\t${total}`);
    });

    // --- TOTALES ---
    result
        .line('--------------------------------')
        .align('right')
        .line(`GRAVADA: ${factura.gravadas.toFixed(2)}`)
        .line(`IGV (18%): ${factura.igv.toFixed(2)}`)
        .bold(true)
        .size(13)
        .line(`TOTAL: ${factura.total.toFixed(2)}`)
        .bold(false);

    // --- INFORMACIÓN ADICIONAL (Gasolineras) ---
    // result
    //     .align('left')
    //     .line(`Producto: ${factura.dec_combustible}`)
    //     .line(`Pistola: ${factura.pistola || '0'}`)
    //     .line(`Medidor Inicio: ${factura.inicio_medidor?.toFixed(3) || '0.000'}`)
    //     .line(`Medidor Fin: ${factura.fin_medidor?.toFixed(3) || '0.000'}`)
    //     .newline();

    // --- CÓDIGO QR ---
    //20100100100|03|B001|00990227|0.6|3.91|2026-04-24|0|42187637|BVKe+moPworj5JBhyHkj8Dgl1YY=
    const qr = factura.cadena_para_codigo_qr ?? hash;

    result
        .align('center')
        .qrcode(qr, 1, 4, 'l') // cadena, model, size, error correction
        .newline()
        .align('left')
        .line(`hash: ${factura.codigo_hash}`)
        .cut();

    return result.encode();
};

export const generarTicketComprobante = (factura: IComprobanteAdmin): Uint8Array => {
    const encoder = new EscPosEncoder();
    // Inicializar el encoder
    let result = encoder.initialize();
    //20100100100|03|B001|00990227|0.6|3.91|2026-04-24|0|42187637|BVKe+moPworj5JBhyHkj8Dgl1YY=
    const ruc = process.env.NEXT_PUBLIC_RS||"" 
    const hash = `${ruc}|${factura.numeracion_comprobante}|${factura.igv}|${factura.total}|${factura.Receptor.tipo_documento}|${factura.Receptor.numero_documento}`

    let tipo_comprobante = '';
    switch (factura.tipo_comprobante) {
        case '01':
            tipo_comprobante = 'FACTURA ELECTRONICA'
            break;
        case '03':
            tipo_comprobante = 'BOLETA ELECTRONICA'
            break;
        case '07':
            tipo_comprobante = 'NOTA DE CREDITO ELECTRONICA'
            break;
        case '08':
            tipo_comprobante = 'NOTA DE DEBITO ELECTRONICA'
            break;
        case '50':
            tipo_comprobante = 'NOTA DE DESPACHO'
            break;
        case '51':
            tipo_comprobante = 'CALIBRACION'
            break;
        case '52':
            tipo_comprobante = 'NOTA INTERNA'            
            break;            
        default:
            break;
    }

    // --- CABECERA ---
    result
        .codepage('cp858') 
        .align('center')
        .line(`${ruc}`) // Nombre fijo o sacado de otro lugar
        .line(`RUC: ${factura.ruc}`)               // Tu RUC emisor
        .line(process.env.NEXT_PUBLIC_EMISOR_DIR||"")
        .newline()
        .bold(true)
        .line(`${tipo_comprobante}`)
        .line(`${factura.numeracion_comprobante}`)
        .bold(false)
        .newline();

    // --- DATOS DEL CLIENTE ---
    result
        .align('left')
        .line(`FECHA:\t${toLocaleShow(factura.fecha_hora)}`)
        .line(`CLIEN:\t${factura.Receptor.razon_social || 'PÚBLICO GENERAL'}`)
        .line(`DOCUM:\t${factura.Receptor.numero_documento || '0'}`)
        .line(`PLACA:\t${factura.Receptor.placa || '---'}`)
        .line('---------------------------------------')
        .line(`CANT\tDESCRIPCION\tP.UNIT\tTOTAL`)
        .line('---------------------------------------');

    // --- DETALLE DE PRODUCTOS ---
    factura.items?.forEach((item: IComprobanteAdminItem) => {
        // Formateamos para que las columnas queden alineadas
        // Ejemplo: 10.50 GL  GASOHOL 95  16.50  173.25
        const cantidad = item.cantidad_venta.toFixed(3);
        const descripcion = item.descripcion.substring(0, 15).padEnd(15, ' ');
        const precio = item.precio.toFixed(2);
        const total = item.precio_venta.toFixed(2);

        result.line(`${cantidad}\t${descripcion}\t${precio}\t${total}`);
    });

    // --- TOTALES ---
    result
        .line('--------------------------------')
        .align('right')
        .line(`GRAVADA: ${factura.gravadas.toFixed(2)}`)
        .line(`IGV (18%): ${factura.igv.toFixed(2)}`)
        .bold(true)
        .size(13)
        .line(`TOTAL: ${factura.total.toFixed(2)}`)
        .bold(false);

    // --- INFORMACIÓN ADICIONAL (Gasolineras) ---
    // result
    //     .align('left')
    //     .line(`Producto: ${factura.dec_combustible}`)
    //     .line(`Pistola: ${factura.pistola || '0'}`)
    //     .line(`Medidor Inicio: ${factura.inicio_medidor?.toFixed(3) || '0.000'}`)
    //     .line(`Medidor Fin: ${factura.fin_medidor?.toFixed(3) || '0.000'}`)
    //     .newline();

    // --- CÓDIGO QR ---
    //20100100100|03|B001|00990227|0.6|3.91|2026-04-24|0|42187637|BVKe+moPworj5JBhyHkj8Dgl1YY=

    result
        .align('center')
        .qrcode(hash, 1, 4, 'l') // cadena, model, size, error correction
        .newline()
        .cut();

    return result.encode();
};

interface IDataCierre {
    detalles: ICierreTurnoDetalle[];
    totalesSoles: ICierreTurnoSoles;
    gastos: IGastos[];
    depositos: IDepositos[];
}

export const imprimirCierreTurno = (data: IDataCierre): Uint8Array => {
    const encoder = new EscPosEncoder();
    const anchoTotal = 42; // Ajustar a 42 si usas papel de 80mm

    let result = encoder.initialize();

    // --- CABECERA ---
    result
        .codepage('cp858') 
        .align('center')
        .bold(true)
        .line('VENTAS DEL DÍA')
        .bold(false)
        .line('2026')
        .newline();

    // --- SECCIÓN 1: VENTA GALONES/CANTIDAD ---
    const cab_prod = ('PRODUCTO').padEnd(13, ' ');
    const cab_cant = ('GAL').padEnd(13, ' ');
    const cab_impo = ('IMPORTE').padEnd(13, ' ');
    result
        .align('center')
        .bold(true)
        .line('VENTA GALONES')
        .bold(false)
        .align('left')
        .line(`${cab_prod}${cab_cant}${cab_impo}`)
        .line('-'.repeat(anchoTotal));

    let subTotalGal = 0;
    let subTotalSolesVenta = 0;

    data.detalles.filter(item=>item.medida == Constants.MEDIDA.GALON).forEach(item => {
        const prod = item.producto.substring(0, 13).padEnd(13, ' ');
        const gal = item.total_cantidad.toFixed(3).padStart(13, ' ');
        const soles = currencyFormat(item.total_soles).padStart(13, ' ');
        
        result.line(`${prod}${gal}${soles}`);
        
        subTotalGal += item.total_cantidad;
        subTotalSolesVenta += item.total_soles;
    });

    result
        .line('-'.repeat(anchoTotal))
        .bold(true)
        .line(`SUB TOTAL`.padEnd(13, ' ') + 
              subTotalGal.toFixed(3).padStart(13, ' ') + 
              (currencyFormat(subTotalSolesVenta)).padStart(13, ' '))
        .bold(false)
        .newline();



    // --- SECCIÓN 2: VENTA DE PRODUCTOS ---
    let subTotalProd = 0;
    let subTotalSolesVentaProd = 0;    
    const cab_cant_prod = ('CAN').padEnd(13, ' ');
    result
        .align('center')
        .bold(true)
        .line('VENTA DE PRODUCTOS')
        .bold(false)
        .align('left')
        .line(`${cab_prod}${cab_cant_prod}${cab_impo}`)
        .line('-'.repeat(anchoTotal));

    data.detalles.filter(item=>item.medida != Constants.MEDIDA.GALON).forEach(item => {
        const prod = item.producto.substring(0, 13).padEnd(13, ' ');
        const gal = item.total_cantidad.toFixed(3).padStart(13, ' ');
        const soles = currencyFormat(item.total_soles).padStart(13, ' ');
        
        result.line(`${prod}${gal}${soles}`);
        
        subTotalProd += item.total_cantidad;
        subTotalSolesVentaProd += item.total_soles;
    });    

    result
        .line('-'.repeat(anchoTotal))
        .bold(true)
        .line(`SUB TOTAL`.padEnd(13, ' ') + 
              subTotalProd.toFixed(3).padStart(13, ' ') + 
              (currencyFormat(subTotalSolesVentaProd)).padStart(13, ' '))
        .bold(false)
        .newline();

    // --- SECCIÓN 2: VENTA POR TIPO DE PAGO ---
    result
        .align('center')
        .bold(true)
        .line('VENTA POR TIPO DE PAGO')
        .bold(false)
        .align('left')
        .line('TIPO                    MONTO')
        .line('-'.repeat(anchoTotal));

    const filaPago = (label: string, monto: number) => {
        return label.padEnd(20, ' ') + currencyFormat(monto).padStart(12, ' ');
    };
    const { yape, efectivo, tarjeta } = data.totalesSoles;
    result
        .line(filaPago('EFECTIVO', efectivo))
        .line(filaPago('TARJETA', tarjeta))
        .line(filaPago('YAPE', yape))
        .line('-'.repeat(anchoTotal))
        .bold(true)
        .line(filaPago('SUB TOTAL', (efectivo + tarjeta + yape)))
        .bold(false)
        .newline();

    // --- SECCIÓN 3: GASTOS (Opcional según tu lógica) ---
    if (data.depositos.length > 0) {
        result
            .align('center')
            .bold(true)
            .line('DEPOSITOS')
            .bold(false)
            .align('left');
        
        data.depositos.forEach(g => {
            result.line(`${g.concepto.substring(0, 20).padEnd(20, ' ')} S/ ${currencyFormat(g.monto).padStart(8, ' ')}`);
        });
        result.newline();
    }

    if (data.gastos.length > 0) {
        result
            .align('center')
            .bold(true)
            .line('GASTOS')
            .bold(false)
            .align('left');
        
        data.gastos.forEach(g => {
            result.line(`${g.concepto.substring(0, 20).padEnd(20, ' ')} S/ ${currencyFormat(g.monto).padStart(8, ' ')}`);
        });
        result.newline();
    }    

    // --- PIE DE PÁGINA ---
    result
        .align('center')
        .newline()
        .line('--------------------------')
        .line('Firma del Responsable')
        .newline()
        .cut();

    return result.encode();
};