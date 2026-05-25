'use client';

import { useState } from 'react';

interface Props {
  total: number;
  onTotalChanged: ( value: number ) => void; 
}

export const TotalSelector = ( { total, onTotalChanged }: Props ) => {

  const [value, setValue] = useState<number | string>(total);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (val === '') {
      setValue('');
      return;
    }    
    const value = Number(event.target.value);
    if ( Number.isNaN(value) || value < 0 ) return;
    setValue(value);
    onTotalChanged( value );
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="nombre" className="font-medium text-gray-700">
        Total:
      </label>
      <input
        id="nombre"
        name="nombre"
        type="number"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500 w-40"
      />        
    </div>
  );
};