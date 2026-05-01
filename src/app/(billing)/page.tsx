import { auth } from "@/auth.config";
import { AbastecimientoGrid, Title } from "@/components";
import { sendMiFactBilling } from "@/jobs/billing";

export default async function Home() {

  const session = await auth();
  await sendMiFactBilling()
  return (
    <>
        <Title 
          title= {`Abastecimientos`}
          subtitle= {`${session?.user?.isla} - ${session?.user?.jornada} - ${session?.user?.nombre}`}
          className="mb-1"
        />


        <AbastecimientoGrid />
    </>
  );
}
