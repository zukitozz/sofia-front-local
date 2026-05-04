import { auth } from "@/auth.config";
import { AbastecimientoGrid, Title } from "@/components";

export default async function Home() {

  const session = await auth();
  return (
    <>
        <Title 
          title= {`Abastecimientos`}
          subtitle= {`${session?.user?.isla} - ${session?.user?.jornada} - ${session?.user?.nombre}`}
          className="mb-1"
        />
        <AbastecimientoGrid pistolas={session?.user?.pistolas ?? []} />
    </>
  );
}
