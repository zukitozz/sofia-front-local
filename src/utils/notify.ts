import toast from 'react-hot-toast';
interface Props {
    message: string;
    type?: 'success'|'error';
}
export const notify = ({message, type = 'success'}:Props) => {
    const options = {
        duration: type === 'error' ? 10000 : 5000,
        position: 'bottom-center' as const, // <-- Esto centra el toast
    };    
    switch (type) {
        case 'error':
            toast.error(message, options);
            break;
        default:
            toast.success(message, options);
            break;
    }
};