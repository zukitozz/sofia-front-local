export const currencyFormat = (value: number) => {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  
};

export const redondear = (value: number, decimals?: number) => {
  switch (decimals) {
    case 10:
      return Math.round(value * 1e10) / 1e10; 
    case 3:
      return Math.round(value * 1000) / 1000;       
    default:
      return Math.round(value * 100) / 100;
  }
}

export const toLocaleStorage = (date: string|Date) => {
  let fecha: Date;
  if (typeof date === 'string'){
    fecha = new Date(date);
  }else {
    fecha = date;
  }
  if (fecha === undefined){
    return '';
  }
  return fecha.toLocaleString('sv-SE', {timeZone: 'America/Lima' });
}

export const toLocaleShow = (date: string|Date) => {
  let fecha: Date;
  if (typeof date === 'string'){
    fecha = new Date(date);
  }else {
    fecha = date;
  }
  if (fecha === undefined){
    return '';
  }  
  return fecha.toISOString().replace('T', ' ').replace(/\..*Z$/, '').replace('Z', ''); 
}

export const toLocaleOnlyDate = (date: string|Date) => {
  let fecha: Date;
  if (typeof date === 'string'){
    fecha = new Date(date);
  }else {
    fecha = date;
  }
  return fecha.toISOString().split('T')[0];
}

export const toIsoString = (date: string|Date) => {
  let fecha: Date;
  if (typeof date === 'string'){
    fecha = new Date(date);
  }else {
    fecha = date;
  }  
  return fecha.toISOString().slice(0, 19).replace('T', ' ');
}


