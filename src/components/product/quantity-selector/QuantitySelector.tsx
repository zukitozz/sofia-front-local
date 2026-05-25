'use client';

import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
interface Props {
  quantity: number;
  onQuantityChanged: ( value: number ) => void; 
}



export const QuantitySelector = ( { quantity, onQuantityChanged }: Props ) => {

  const onValueChanged = ( value: number ) => {
    if ( quantity + value < 1 ) return;
    onQuantityChanged( quantity + value );
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="nombre" className="font-medium text-gray-700">
        Cantidad: 
      </label>      
      <button onClick={ () => onValueChanged( -1 ) }>
        <IoRemoveCircleOutline size={ 30 } />
      </button>

      <span className="w-20 mx-1 px-5 bg-gray-100 text-center rounded">
        { quantity }
      </span>

      <button onClick={ () => onValueChanged( +1 ) }>
        <IoAddCircleOutline size={ 30 } />
      </button>

    </div>
  );
};


/*

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
*/ 