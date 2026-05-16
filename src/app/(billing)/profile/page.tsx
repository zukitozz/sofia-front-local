import { auth } from "@/auth.config";
import { Title } from "@/components";
import { ChangePasswordForm } from "./ChangePassForm";

export default async function Perfil() {
    const session = await auth();
    return (
        <>
            <Title 
            title= {`Cambio de contraseña`}
            subtitle= {`${session?.user?.isla} - ${session?.user?.jornada} - ${session?.user?.nombre}`}
            className="mb-1"
            />
            <div className="flex justify-center items-center mb-7 px-10 sm:px-0">
                <ChangePasswordForm />
            </div>        
        </>

    );
}