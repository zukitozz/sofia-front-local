'use client';

import { useState } from 'react';
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

interface Props {
  quantity: number;
  type: string;
  onQuantityChanged: ( value: number ) => void; 
}



export const QuantitySelector = ( { quantity, type, onQuantityChanged }: Props ) => {

  const [value, setValue] = useState<number | string>(quantity);

  const handleInputChange   = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (val === '') {
      setValue('');
      return;
    }    
    const value = Number(event.target.value);
    if ( Number.isNaN(value) || value < 0.1 ) return;
    setValue(value);
    onQuantityChanged( value );
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };
  const onValueChanged = ( value: number ) => {
    if ( quantity + value < 1 ) return;
    onQuantityChanged( quantity + value );
  };


  if ( type === 'GLL' ) {
    return (
      <input
        id="nombre"
        name="nombre"
        type="number"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        className="px-5 py-2 border bg-white rounded shadow-sm focus:outline-blue-500 w-40 mr-5"
      />      
    );
  }
  return (
    <div className="flex">
      <button onClick={ () => onValueChanged( -1 ) }>
        <IoRemoveCircleOutline size={ 30 } />
      </button>

      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">
        { quantity }
      </span>

      <button onClick={ () => onValueChanged( +1 ) }>
        <IoAddCircleOutline size={ 30 } />
      </button>

    </div>
  );
};