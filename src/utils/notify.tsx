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