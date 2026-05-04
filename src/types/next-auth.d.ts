import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as
     * a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: User;
    }
  
    interface User {
        id: string;
        nombre: string;
        usuario: string;
        correo?: string;        
        rol?: string; 
        grifo?: string;
        isla?: string;
        jornada?: string;
        fecha_registro?: string;
        pistolas?: number[];
        islaId: number;
    }
  }