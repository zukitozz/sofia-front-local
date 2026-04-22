import { auth } from "@/auth.config";
import { TopMenu } from "@/components";
import { Sidebar } from "@/components/ui/sidebar/Sidebar";
import { redirect } from 'next/navigation';

export default async function BillingLayout( { children }: {
  children: React.ReactNode;
} ) {
  const session = await auth();

  if ( !session?.user ) {
    redirect('/auth/login');
  }

  return (
    <main className="min-h-screen">
      <TopMenu />
      <Sidebar />
      <div className="px-0 sm:px-10">
        { children }
      </div>
    </main>
  );
}