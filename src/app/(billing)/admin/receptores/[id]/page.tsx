"use server";
import { getReceptor, getUsuario} from '@/actions';
import { initialReceptorForm } from '@/utils';
import { ReceptoresForm } from './receptoresForm';


interface Props {
  params: {
    id: string;
  };
}

export default async function UsuarioIdPage({ params }: Readonly<Props>) {
    const { id } = params;
    let receptor = await getReceptor(+id);

    if ( !receptor ) {
        receptor = initialReceptorForm;
    }

    return (
        <ReceptoresForm receptor={receptor}/>
    );
}