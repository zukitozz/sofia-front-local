"use server";
import { getUsuario} from '@/actions';
import { initialUserForm } from "@/utils";
import { UsuariosForm } from "./usuariosForm";

interface Props {
  params: {
    id: string;
  };
}

export default async function UsuarioIdPage({ params }: Readonly<Props>) {
    const { id } = params;
    let user = await getUsuario(+id);

    if ( !user ) {
        user = initialUserForm;
    }

    return (
        <UsuariosForm usuario={user}/>
    );
}