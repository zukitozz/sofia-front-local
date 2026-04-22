'use server';
import { signIn } from '@/auth.config';
import { headers } from 'next/headers';
 
export async function authenticate(prevState: string | undefined,formData: FormData,) {
  try {
    const headersList = headers();
    formData.append('ip', headersList.get('x-forwarded-for') || 'unknown');
    await signIn('credentials', {...Object.fromEntries(formData), redirect: false,});
    return 'Success';
  } catch (error) {
    console.log('Error in authenticate:');
    console.log(error);
    if((error as Error).message === 'CredentialsSignin') {
    return 'CredentialsSignin'
    }
  return 'UnknownError';
  }
}