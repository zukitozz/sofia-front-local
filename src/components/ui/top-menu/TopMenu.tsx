"use client";

import { useState, useEffect } from 'react';
import { titleFont } from '@/config/fonts'
import { useOrderAbastecimientoStore, useUIStore } from '@/store';
import Link from 'next/link'
// 1. Importamos usePathname
import { usePathname } from 'next/navigation'; 
import { IoSearchOutline, IoCartOutline } from 'react-icons/io5'

export const TopMenu = () => {
    const openSideMenu = useUIStore((state) => state.openSideMenu);
    const totalItemsInCart = useOrderAbastecimientoStore((state) => state.getTotalItems());
    const [loaded, setLoaded] = useState(false);
    
    // 2. Obtenemos la ruta actual
    const pathname = usePathname();

    useEffect(() => {
        setLoaded(true);
    }, [])
  
    return (
        <nav className="flex px-5 justify-between items-center w-full">
            <div>
                <Link href="/">
                    <span className={`${titleFont.className} antialiased font-bold`}>FuelHub </span>
                    <span>| Estación de servicio</span>
                </Link>
            </div>

            {/* 3. Comparamos el pathname actual con el href de cada Link */}
            <div className='hidden sm:block'>
                <Link 
                    className={`m-2 p-2 rounded-md transition-all hover:bg-gray-100 ${
                        pathname === '/' ? 'bg-gray-200 font-semibold' : ''
                    }`} 
                    href="/"
                >
                    Abastecimiento
                </Link>
                
                <Link 
                    className={`m-2 p-2 rounded-md transition-all hover:bg-gray-100 ${
                        pathname === '/historic' ? 'bg-gray-200 font-semibold' : ''
                    }`} 
                    href="/historic"
                >
                    Historico
                </Link>
                
                <Link 
                    className={`m-2 p-2 rounded-md transition-all hover:bg-gray-100 ${
                        pathname === '/market' ? 'bg-gray-200 font-semibold' : ''
                    }`} 
                    href="/market"
                >
                    Market
                </Link>
            </div>

            <div className='flex items-center'>
                <Link href="/search" className='mx-2'>
                    <IoSearchOutline className='w-5 h-5'/>
                </Link>
                <Link href="/cart" className='mx-2'>
                    <div className='relative'>
                        { ( loaded && totalItemsInCart > 0 ) && (
                        <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
                            {totalItemsInCart}
                        </span>
                        )}
                        <IoCartOutline className="w-5 h-5" />
                    </div>
                </Link>
                <button 
                    onClick={openSideMenu}
                    className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'>
                    Menú
                </button>
            </div>
        </nav>
    )
}