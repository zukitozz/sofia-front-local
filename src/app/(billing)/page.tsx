import { auth } from "@/auth.config";
import { AbastecimientoGrid, Title } from "@/components";
import { sendMiFactBilling } from "@/jobs/billing";

export default async function Home() {
  const session = await auth();
  await sendMiFactBilling()
  return (
    <>
        <Title 
          title= {`${session?.user?.nombre}'s Abastecimiento`}
          subtitle="Todos los productos"
          className="mb-1"
        />

        <AbastecimientoGrid />
    </>
  );
}
