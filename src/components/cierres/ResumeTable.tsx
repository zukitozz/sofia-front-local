import { currencyFormat } from "@/utils";

export const ResumenTable = ({ title, headers, children, footerLabel, footerValue }: any) => {
    const numCols = headers.length;

    return (
        <table className="w-full text-lg bg-white border border-gray-300 rounded-lg border-separate mb-4 shadow-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th colSpan={numCols} className="py-2 uppercase text-sm tracking-wider border-b">
                        {title}
                    </th>
                </tr>
            </thead>
            <tbody className="text-sm text-black">
                {/* Encabezados de columna */}
                <tr className="bg-gray-50 font-bold text-gray-600">
                    {headers.map((h: string, index: number) => (
                        <td 
                            key={h} 
                            className={`p-2 border-b ${index === 0 ? 'text-left' : 'text-right'}`}
                        >
                            {h}
                        </td>
                    ))}
                </tr>

                {/* Contenido (filas) */}
                {children}

                {/* Fila de Total */}
                <tr className="font-bold bg-gray-50">
                    <td className="p-2 border-t text-left">
                        {footerLabel}
                    </td>
                    {/* Genera celdas vacías si hay más de 2 columnas para mantener la alineación */}
                    {numCols > 2 && <td className="border-t"></td>}
                    <td className="p-2 border-t text-right text-blue-700">
                        {currencyFormat(footerValue)}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};
