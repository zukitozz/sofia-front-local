import { getBillingToProcess, saveBillingResponse } from '@/actions';
import { createOrderApiMiFact } from '@/utils';

export async function sendMiFactBilling(): Promise<void> {
    const billing = await getBillingToProcess();
    
    if(billing){
        const { hasErrorMiFact, comprobante } = await createOrderApiMiFact(billing);
        saveBillingResponse(comprobante);
    }
}