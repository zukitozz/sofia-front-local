import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { getIslaAuth, getUserAuth, getPistolaAuth } from './actions';
import { mapearUsuarioDBUsuarioLogin } from './utils/supports';
import { headers } from 'next/headers';

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

          const headerList = headers();

          const forwardedFor = headerList.get('x-forwarded-for');
          const realIp = headerList.get('x-real-ip');
          let ipEncoded = '127.0.0.1';

          if (forwardedFor) {
            ipEncoded = forwardedFor.split(',')[0].trim();
          } else if (realIp) {
            ipEncoded = realIp;
          }

          if (ipEncoded.includes('::ffff:')) {
            ipEncoded = ipEncoded.replace(/^.*:ffff:/, '');
          }

          if (ipEncoded === '::1') {
            ipEncoded = '127.0.0.1';
          }          

          const user = await getUserAuth({ usuario, password });
          if ( !user ) return null;
        //   // Comparar las contraseñas
          const passwordincoming = Buffer.from(password, 'binary').toString('base64');
          if( passwordincoming !== user.password ) return null;

          const {nombre, id} = await getIslaAuth( ipEncoded );

          if (!id) {
            console.warn(`Intento de login sin Isla asociada para la IP: ${ipEncoded}`);
          }

          const pistolas = await getPistolaAuth( id );

          return mapearUsuarioDBUsuarioLogin(user, nombre, turno, id, pistolas);
      },
    }),


  ]
}



export const {  signIn, signOut, auth, handlers } = NextAuth( authConfig );