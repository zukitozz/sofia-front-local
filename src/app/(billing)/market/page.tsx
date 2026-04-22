import { auth } from "@/auth.config";
import { MarketGrid, Title } from "@/components";
import { Constants } from "@/utils/constants";

export default async function Market() {
  const session = await auth();
  const tipo_usuario = session?.user?.rol === Constants.ROL.ADMIN_ROLE ? Constants.ROL.ADMIN_ROLE : Constants.ROL.USER_ROLE;
  return (
    <>
        <Title 
          title= {`${session?.user?.nombre}'s Market`}
          subtitle="Todos los productos"
          className="mb-1"
        />

        <MarketGrid tipo_usuario={tipo_usuario} />
    </>
    );
}