import { getAbastecimientos } from '@/actions';
import { Constants } from '@/utils';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
    const abastecimientos = await getAbastecimientos(Constants.ESTADOS_ABASTECIMIENTO.PENDIENTE);
    return NextResponse.json(abastecimientos);
}