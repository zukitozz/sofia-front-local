import toast, { ToastPosition } from 'react-hot-toast';

interface Props {
    message: string;
    type?: 'success' | 'error';
}

export const notify = ({ message, type = 'success' }: Props) => {
    const options = {
        duration: type === 'error' ? 10000 : 5000,
        position: 'bottom-center' as ToastPosition,
    };

    // Creamos el componente del contenido con el botón de cerrar
    const content = (t: { id: string }) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
            {message}
            <button
                onClick={() => toast.dismiss(t.id)} // <-- Cierra este toast específico
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    opacity: 0.5,
                    padding: '0 4px',
                    marginLeft: 'auto', // Empuja la X totalmente a la derecha
                    fontWeight: 'bold'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
            >
                ✕
            </button>
        </span>
    );

    // Ejecutamos manteniendo los estilos nativos (verdes y rojos) de la librería
    if (type === 'error') {
        toast.error((t) => content(t), options);
    } else {
        toast.success((t) => content(t), options);
    }
};

interface ConfirmProps {
    message: string;
    detail?: string[];
    confirmText?: string;
    cancelText?: string;
}

// Variante de notify que espera una decisión: devuelve true si el usuario
// confirma y false si cancela. Reemplaza al window.confirm nativo.
export const notifyConfirm = ({ message, detail = [], confirmText = 'Continuar', cancelText = 'Cancelar' }: ConfirmProps): Promise<boolean> => {
    return new Promise((resolve) => {
        const responder = (id: string, respuesta: boolean) => {
            toast.dismiss(id);
            resolve(respuesta);
        };

        toast.custom((t) => (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 max-w-md w-full">
                <div className="flex items-start gap-3">
                    <span className="text-amber-500 text-xl leading-none">⚠️</span>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{message}</p>
                        {detail.length > 0 && (
                            <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc list-inside">
                                {detail.map((linea, i) => <li key={i}>{linea}</li>)}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={() => responder(t.id, false)}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => responder(t.id, true)}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        ), { duration: Infinity, position: 'top-center' });
    });
};