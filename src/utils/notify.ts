import toast from 'react-hot-toast';
interface Props {
    message: string;
    type?: 'success'|'error';
}
export const notify = ({message, type = 'success'}:Props) => {
    switch (type) {
        case 'error':
            toast.error(message, { duration: 10000 });
            break;
        default:
            toast.success(message, { duration: 5000 });
            break;
    }
};