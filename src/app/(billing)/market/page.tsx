import { auth } from "@/auth.config";
import { BarcodeListener, MarketGrid, Title } from "@/components";
import { Constants } from "@/utils/constants";

export default async function Market() {
  const session = await auth();
  const tipo_usuario = session?.user?.rol === Constants.ROL.ADMIN_ROLE ? Constants.ROL.ADMIN_ROLE : Constants.ROL.USER_ROLE;
  return (
    <>
        <BarcodeListener />
        <Title 
          title= {`Market`}
          subtitle= {`${session?.user?.isla} - ${session?.user?.jornada} - ${session?.user?.nombre}`}
          className="mb-1"
        />

        <MarketGrid tipo_usuario={tipo_usuario} />
    </>
    );
}