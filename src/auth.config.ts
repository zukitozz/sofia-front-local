import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { getIslaAuth, getUserAuth } from './actions';
import { mapearUsuarioDBUsuarioLogin } from './utils/supports';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account',
  },

  callbacks: {

    authorized({ auth, request: { nextUrl } }) {
      // const isLoggedIn = !!auth?.user;

      // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      // if (isOnDashboard) {
      //   if (isLoggedIn) return true;
      //   return false; // Redirect unauthenticated users to login page
      // } else if (isLoggedIn) {
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      return true;
    },

    jwt({ token, user }) {
      if ( user ) {
        token.data = user;
      }

      return token;
    },

    session({ session, token, user }) {
      session.user = token.data as any;
      return session;
    },

  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ usuario: z.string(), password: z.string().min(4), ip: z.string(), turno: z.string() })
          .safeParse(credentials);

          if ( !parsedCredentials.success ) return null;

          const { usuario, password, ip, turno } = parsedCredentials.data;
          // Buscar el correo
          const user = await getUserAuth({ usuario, password });
          if ( !user ) return null;
        //   // Comparar las contraseñas
          const passwordincoming = Buffer.from(password, 'binary').toString('base64');
          if( passwordincoming !== user.password ) return null;
        //   // Regresar el usuario sin el password
          //const { password: _, ...rest } = user;
          const isla = await getIslaAuth( ip );
          //TODO: manejar el caso cuando no hay isla y guardar el logica de logs
          return mapearUsuarioDBUsuarioLogin(user, isla, turno);
      },
    }),


  ]
}



export const {  signIn, signOut, auth, handlers } = NextAuth( authConfig );