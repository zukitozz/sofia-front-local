import { ICierreTurnoDetalle, ICierreTurnoSoles, IComprobanteAdmin, ICierreTurnoResponse } from '@/interfaces';
import sql, { ConnectionPool, ISqlTypeFactoryWithLength, ISqlTypeFactoryWithNoParams, Transaction } from 'mssql';
import { Constants } from './constants';
import { Session } from 'next-auth';

    const config: sql.config = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER||"", // e.g., 'localhost\\SQLEXPRESS' or 'your-azure-sql-server.database.windows.net'
        database: "",
        options: {
            encrypt: false, // Use for Azure SQL Database or if you have SSL/TLS configured
            trustServerCertificate: false // Change to false in production with a valid certificate
        }
    };

    interface PaginationParams {
        page: number; // Current page number
        limit: number; // Items per page
    }

    export function getOffset(params: PaginationParams): number {
        return (params.page - 1) * params.limit;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export async function executeQuery<T>(database: string, query: string, params?: { name: string, value: any, type: ISqlTypeFactoryWithLength|ISqlTypeFactoryWithNoParams }[]): Promise<T> {
        try {
            config.database = database;
            const pool = await sql.connect(config);
            const request = pool.request();

            if (params) {
                params.forEach(p => {
                    request.input(p.name, p.type, p.value);
                });
            }
            const result = await request.query(query);
            return result.recordset as unknown as T;
        } catch (err) {
            console.error("Error fetching executeQuery:");
            console.error(JSON.stringify(err));
            throw err;
        }
    }

    export async function saveBillingTransaction(comprobante: IComprobanteAdmin): Promise<IComprobanteAdmin> {
        config.database = process.env.DB_DATABASE_AUXILIAR||"";
        try {
            const { 
                tipo_comprobante, fecha_emision, tipo_moneda, tipo_operacion, tipo_nota,
                tipo_documento_afectado, fecha_documento_afectado, numeracion_documento_afectado,
                motivo_documento_afectado, gravadas, igv, total, monto_letras, fecha_abastecimiento,
                id_abastecimiento, pistola, codigo_combustible, dec_combustible, volumen,
                inicio_medidor, fin_medidor, tiempo_abastecimiento, volumen_tanque,
                comentario, tarjeta, efectivo, yape, placa, billete, producto_precio, ruc, 
                enviado, estado_nota_despacho, comprobante_nota_despacho, fecha_facturado_nota_despacho,
                Receptor, UsuarioId, fecha_hora, impresion, IslaId
            } = comprobante;
            const pool: ConnectionPool = await sql.connect(config);
            const transaction: Transaction = new sql.Transaction(pool);
            await transaction.begin();

            try {
                    //Obtiene prefijo
                    let prefijo: string = '';
                    if (tipo_comprobante === '07') {
                        prefijo = 'NC';
                    } else if (tipo_comprobante === '01') {
                        prefijo = 'F';
                    } else if (tipo_comprobante === '03') {
                        prefijo = 'B';
                    } else if (tipo_comprobante === '50') {
                        prefijo = 'N';                        
                    } else if (tipo_comprobante === '51') {
                        prefijo = 'C';
                    } else if (tipo_comprobante === '52') {
                        prefijo = 'I';                                                
                    }
                    //Obtener Serie
                    const sqlSerieRequest = new sql.Request(transaction);
                    sqlSerieRequest.input('tipo_comprobante', sql.NVarChar, tipo_comprobante);
                    sqlSerieRequest.input('tipo_facturacion', sql.NVarChar, 'FACTURAS_BOLETAS_NC_INTERNA');
                    const serie = await sqlSerieRequest.query(`SELECT serie from Series c where tipo_comprobante = @tipo_comprobante and codigo_proposito= @tipo_facturacion`);
                    console.log("Resultado de consulta de serie:", serie);
                    const serieId = serie.recordset[0]?.serie;
                    const sqlCorrelativoRequest = new sql.Request(transaction);
                    sqlCorrelativoRequest.input('idTipoDocumento', sql.NVarChar, tipo_comprobante);
                    sqlCorrelativoRequest.input('idSerie', sql.NVarChar, serieId);
                    sqlCorrelativoRequest.input('prefijo', sql.NVarChar, prefijo);
                    sqlCorrelativoRequest.input('ruc', sql.NVarChar, ruc);
                    sqlCorrelativoRequest.output('correlativo', sql.NVarChar);
                    sqlCorrelativoRequest.output('resultado', sql.Char);
                    const correlativo = await sqlCorrelativoRequest.execute(`dbo.spCorrelativoObtener`);
                    console.log("Resultado de consulta de correlativo:", correlativo);
                    if (correlativo.output['resultado'].trim() !== Constants.STATE_SQL_TRANSACTION.SUCCESS) {
                        throw new Error('Error al obtener correlativo: ' + correlativo.output['resultado'].trim());
                    }
                    const numeracion_comprobante = correlativo.output['correlativo'];
                    comprobante.numeracion_comprobante = numeracion_comprobante;
                    //Obtener receptor
                    const sqlReceptorRequest = new sql.Request(transaction);
                    sqlReceptorRequest.input('numero', sql.NVarChar, Receptor.numero_documento);
                    sqlReceptorRequest.input('razon', sql.NVarChar, Receptor.razon_social);
                    sqlReceptorRequest.input('direccion', sql.NVarChar, Receptor.direccion);
                    sqlReceptorRequest.input('correo', sql.NVarChar, Receptor.correo);
                    sqlReceptorRequest.input('placa', sql.NVarChar, Receptor.placa);
                    sqlReceptorRequest.input('usuario', sql.Int, UsuarioId);
                    sqlReceptorRequest.output('resultado', sql.Int);
                    const receptor = await sqlReceptorRequest.execute(`dbo.spReceptorCrear`);
                    console.log("Resultado de consulta de receptor:", receptor);
                    const id_receptor = receptor.output['resultado']
                    //Insertar comprobante
                    const sqlRequest = new sql.Request(transaction);
                    sqlRequest.input('tipo_comprobante', sql.NVarChar, tipo_comprobante);
                    sqlRequest.input('numeracion_comprobante', sql.NVarChar, numeracion_comprobante);
                    sqlRequest.input('fecha_emision', sql.NVarChar, fecha_emision);
                    sqlRequest.input('tipo_moneda', sql.NVarChar, tipo_moneda);
                    sqlRequest.input('tipo_operacion', sql.NVarChar, tipo_operacion);
                    sqlRequest.input('tipo_nota', sql.NVarChar, tipo_nota);
                    sqlRequest.input('tipo_documento_afectado', sql.NVarChar, tipo_documento_afectado);
                    sqlRequest.input('fecha_documento_afectado', sql.NVarChar, fecha_documento_afectado);
                    sqlRequest.input('numeracion_documento_afectado', sql.NVarChar, numeracion_documento_afectado);
                    sqlRequest.input('motivo_documento_afectado', sql.NVarChar, motivo_documento_afectado);
                    sqlRequest.input('gravadas', sql.Float, gravadas);
                    sqlRequest.input('igv', sql.Float, igv);
                    sqlRequest.input('total', sql.Float, total);
                    sqlRequest.input('monto_letras', sql.NVarChar, monto_letras);
                    sqlRequest.input('id_abastecimiento', sql.Int, id_abastecimiento);
                    sqlRequest.input('pistola', sql.Float, pistola);
                    sqlRequest.input('codigo_combustible', sql.NVarChar, codigo_combustible);
                    sqlRequest.input('dec_combustible', sql.NVarChar, dec_combustible);
                    sqlRequest.input('volumen', sql.Float, volumen);
                    sqlRequest.input('fecha_abastecimiento', sql.NVarChar, fecha_abastecimiento);
                    sqlRequest.input('inicio_medidor', sql.Float, inicio_medidor);
                    sqlRequest.input('fin_medidor', sql.Float, fin_medidor);
                    sqlRequest.input('tiempo_abastecimiento', sql.Int, tiempo_abastecimiento);
                    sqlRequest.input('volumen_tanque', sql.Float, volumen_tanque);
                    sqlRequest.input('comentario', sql.NVarChar, comentario);
                    sqlRequest.input('pago_tarjeta', sql.Float, tarjeta);
                    sqlRequest.input('pago_efectivo', sql.Float, efectivo);
                    sqlRequest.input('pago_yape', sql.Float, yape);
                    sqlRequest.input('placa', sql.NVarChar, placa);
                    sqlRequest.input('billete', sql.Float, billete);
                    sqlRequest.input('producto_precio', sql.Float, producto_precio);
                    sqlRequest.input('ruc', sql.NVarChar, ruc);
                    sqlRequest.input('enviado', sql.Bit, enviado);
                    sqlRequest.input('estado_nota_despacho', sql.NVarChar, estado_nota_despacho);
                    sqlRequest.input('comprobante_nota_despacho', sql.NVarChar, comprobante_nota_despacho);
                    sqlRequest.input('fecha_facturado_nota_despacho', sql.NVarChar, fecha_facturado_nota_despacho);
                    sqlRequest.input('ReceptorId', sql.Int, id_receptor);
                    sqlRequest.input('UsuarioId', sql.Int, UsuarioId);
                    sqlRequest.input('CierreTurnoId', sql.Int, null);
                    sqlRequest.input('fecha_hora', sql.NVarChar, fecha_hora);
                    sqlRequest.input('impresion', sql.Int, Receptor.numero_documento === '0'?1:impresion);
                    sqlRequest.input('IslaId', sql.Int, IslaId);

                    const query_insert = `INSERT INTO Comprobantes (
                            tipo_comprobante, numeracion_comprobante, fecha_emision, tipo_moneda, tipo_operacion, tipo_nota,
                            tipo_documento_afectado, fecha_documento_afectado, numeracion_documento_afectado,
                            motivo_documento_afectado, total_gravadas, total_igv, total_venta, monto_letras,
                            id_abastecimiento, pistola, codigo_combustible, dec_combustible, volumen,
                            fecha_abastecimiento, inicio_medidor, fin_medidor, tiempo_abastecimiento,
                            volumen_tanque, comentario, pago_tarjeta, pago_efectivo, pago_yape, 
                            placa, billete, producto_precio, ruc, enviado, 
                            estado_nota_despacho, comprobante_nota_despacho, fecha_facturado_nota_despacho, 
                            ReceptorId, UsuarioId, CierreTurnoId, fecha_hora, 
                            gravadas, igv, total, impresion, IslaId
                        ) VALUES (@tipo_comprobante, @numeracion_comprobante, @fecha_emision, @tipo_moneda, @tipo_operacion, @tipo_nota,
                            @tipo_documento_afectado, @fecha_documento_afectado, @numeracion_documento_afectado,
                            @motivo_documento_afectado, @gravadas, @igv, @total, @monto_letras,
                            @id_abastecimiento, @pistola, @codigo_combustible, @dec_combustible, @volumen,
                            @fecha_abastecimiento, @inicio_medidor, @fin_medidor, @tiempo_abastecimiento,
                            @volumen_tanque, @comentario, @pago_tarjeta, @pago_efectivo, @pago_yape,
                            @placa, @billete, @producto_precio, @ruc, @enviado, 
                            @estado_nota_despacho, @comprobante_nota_despacho, @fecha_facturado_nota_despacho,
                            @ReceptorId, @UsuarioId, @CierreTurnoId, @fecha_hora, 
                            @gravadas, @igv, @total, @impresion, @IslaId
                        ); SELECT SCOPE_IDENTITY() AS id;`
                    const result = await sqlRequest.query(query_insert);
                    console.log("Resultado de inserción de comprobante:", result);
                    const comprobanteId = result.recordset[0]?.id;
                    //Insertar items
                    for (const item of comprobante.items) {
                        const itemRequest = new sql.Request(transaction);
                        itemRequest.input('ComprobanteId', sql.Int, comprobanteId);
                        itemRequest.input('cantidad', sql.VarChar, item.cantidad_string);
                        itemRequest.input('valor_unitario', sql.Decimal(18,2), item.valor_unitario_string);
                        itemRequest.input('precio_unitario', sql.Decimal(18,2), item.precio_unitario_string);
                        itemRequest.input('igv', sql.Decimal(18,2), item.igv_string);
                        itemRequest.input('descripcion', sql.NVarChar, item.descripcion);
                        itemRequest.input('codigo_producto', sql.NVarChar, item.codigo_producto);
                        itemRequest.input('medida', sql.NVarChar, item.medida);
                        itemRequest.input('valor_venta', sql.Float, item.valor_venta);
                        itemRequest.input('precio_venta', sql.Decimal(18,2), item.precio_venta);
                        itemRequest.input('valor', sql.Float, item.valor);
                        itemRequest.input('precio', sql.Float, item.precio);
                        itemRequest.input('igv_venta', sql.Float, item.igv_venta);
                        itemRequest.input('codigo', sql.Int, item.codigo);
                        itemRequest.input('cantidad_venta', sql.Float, item.cantidad_venta);
                        await itemRequest.query(`INSERT INTO Items (
                                ComprobanteId, cantidad, valor_unitario, precio_unitario, igv, descripcion,
                                codigo_producto, medida, valor_venta, precio_venta, valor, precio, igv_venta, codigo, cantidad_venta
                            ) VALUES (@ComprobanteId, @cantidad, @valor_unitario, @precio_unitario, @igv, @descripcion,
                                @codigo_producto, @medida, @valor_venta, @precio_venta, @valor, @precio, @igv_venta, @codigo, @cantidad_venta
                            );`);
                    }   
                    //Actualizar abastecimientos
                    const sqlRequestAbatecimientos = new sql.Request(transaction);
                    sqlRequestAbatecimientos.input('idAbastecimiento', sql.Int, id_abastecimiento);
                    await sqlRequestAbatecimientos.query(`Update DEMOSQL.dbo.Abastecimientos set estado = 1 where idAbastecimiento = @idAbastecimiento`);
                await transaction.commit();
                return comprobante;
            } catch (err) {
                console.error("Error executing transaction:");
                console.error(JSON.stringify(err));
                await transaction.rollback();
                throw err;
            }
        } catch (error) {
            console.error("Error executing transaction:");
            console.error(JSON.stringify(error));
            throw error;
        }
    }
    export async function saveCierreTurnoTransaction(session: Session|null, total: number, soles: ICierreTurnoSoles, productos: ICierreTurnoDetalle[]): Promise<ICierreTurnoResponse>{
        config.database = process.env.DB_DATABASE_AUXILIAR||"";
        const pool: ConnectionPool = await sql.connect(config);
        try {
            
            const transaction: Transaction = new sql.Transaction(pool);
            try {
                const usuarioId = +(session?.user.id || 0);
                const turno = session?.user.jornada || "";
                const isla = session?.user.isla || "";
                await transaction.begin();
                //Insertar cierre
                const sqlRequest = new sql.Request(transaction);
                sqlRequest.input('total', sql.Float, total);
                sqlRequest.input('turno', sql.NVarChar, turno);
                sqlRequest.input('isla', sql.NVarChar, isla);
                sqlRequest.input('efectivo', sql.Float, soles.efectivo);
                sqlRequest.input('tarjeta', sql.Float, soles.tarjeta);
                sqlRequest.input('yape', sql.Float, soles.yape);
                sqlRequest.input('UsuarioId', sql.Int, usuarioId);

                const result = await sqlRequest.query(`INSERT INTO Cierreturnos (
                    total, fecha, turno, isla, efectivo, tarjeta, yape, UsuarioId
                ) VALUES ( 
                    @total, GETDATE(), @turno, @isla, @efectivo, @tarjeta, @yape, @UsuarioId
                ); SELECT SCOPE_IDENTITY() AS id;`);
                
                const cierreturnoId = result.recordset[0]?.id;

                //Insertar detalle cierre
                const products_insert = productos.map(n => `(${cierreturnoId},${Object.values(n).map(v => `'${v}'`).join(", ")})`).join(', ')

                const sqlRequestCierreDetalle = new sql.Request(transaction);
                await sqlRequestCierreDetalle.query(`INSERT INTO Cierreturnosdetalle (
                    CierreturnoId,producto,medida,codigo,total_cantidad,calibracion_cantidad,despacho_cantidad,total_soles,calibracion_soles,despacho_soles 
                ) VALUES ${products_insert}`);

                //Actualizar abastecimientos
                const sqlRequestComprobantes = new sql.Request(transaction);
                sqlRequestComprobantes.input('CierreturnoId', sql.Int, cierreturnoId);
                sqlRequestComprobantes.input('UsuarioId', sql.Int, usuarioId);
                await sqlRequestComprobantes.query(`Update Comprobantes set CierreturnoId = @CierreturnoId where UsuarioId = @UsuarioId and CierreturnoId is null`);

                //Actualizar gastos
                const sqlRequestGastos = new sql.Request(transaction);
                sqlRequestGastos.input('CierreturnoId', sql.Int, cierreturnoId);
                sqlRequestGastos.input('UsuarioId', sql.Int, usuarioId);
                await sqlRequestGastos.query(`Update Gastos set CierreturnoId = @CierreturnoId where UsuarioId = @UsuarioId and CierreturnoId is null`);

                //Actualizar gastos
                const sqlRequestDepositos = new sql.Request(transaction);
                sqlRequestDepositos.input('CierreturnoId', sql.Int, cierreturnoId);
                sqlRequestDepositos.input('UsuarioId', sql.Int, usuarioId);
                await sqlRequestDepositos.query(`Update Depositos set CierreturnoId = @CierreturnoId where UsuarioId = @UsuarioId and CierreturnoId is null`);

                await transaction.commit();

                return {
                    message: "Cierre realizado correctamente",
                    status: true,                    
                }
            }catch(error){
                console.error("Error executing transaction: saveCierreTurnoTransaction");
                console.error(JSON.stringify(error));
                await transaction.rollback();
                return {
                    message: `Error al cerrar turno | ${JSON.stringify(error)}`,
                    status: false,                    
                }
            }            
        } catch (error) {
            console.error("Pool connection error:", error);
            return {
                message: `Error al cerrar turno | ${JSON.stringify(error)}`,
                status: false,                    
            }            
        } finally {
            if (pool) await pool.close();
        }
    }

    export async function saveCierreDiaTransaction(total: number, isla: string){
        config.database = process.env.DB_DATABASE_AUXILIAR||"";
        try {
            const pool: ConnectionPool = await sql.connect(config);
            const transaction: Transaction = new sql.Transaction(pool);
            await transaction.begin();
            //Insertar cierre
            const sqlRequest = new sql.Request(transaction);
            sqlRequest.input('total', sql.Float, total);
            sqlRequest.input('isla', sql.NVarChar, isla);

            const result = await sqlRequest.query(`INSERT INTO Cierredias (
                total, fecha, isla, estado
            ) VALUES ( 
                @total, GETDATE(), @isla, 1
            ); SELECT SCOPE_IDENTITY() AS id;`);
            
            const cierrediaId = result.recordset[0]?.id;

            //Actualizar cierre turnos
            const sqlRequestComprobantes = new sql.Request(transaction);
            sqlRequestComprobantes.input('CierrediaId', sql.Int, cierrediaId);
            await sqlRequestComprobantes.query(`Update Cierreturnos set CierrediaId = @CierrediaId where CierrediaId is null`);

            await transaction.commit();
        }catch(error){
            console.error("Error executing transaction: saveCierreDiaTransaction");
            console.error(JSON.stringify(error));
            throw error;
        }
    }    