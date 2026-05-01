import { generarTicketHistorico, Print } from '@/utils';
import { IComprobanteHistorico } from '@/interfaces';
import { IoPrint } from 'react-icons/io5';
import React from 'react'
interface Props {
    factura: IComprobanteHistorico
}
export const PrintComprobanteButton = ({ factura }: Props) => {
  const handlePrint = async () => {
    const bytes = generarTicketHistorico(factura);
    await Print({bytes})
  };    
  return (
    <IoPrint size={30} onClick={handlePrint} cursor={'pointer'}/>
  )
}
