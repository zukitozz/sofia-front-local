import { getBillingToProcess, saveBillingResponse } from '@/actions';
import { createOrderApiMiFact } from '@/utils';

export async function sendMiFactBilling(): Promise<void> {
    const billing = await getBillingToProcess();
    console.log('Billing to process:', billing);
    if(billing){
        const { hasErrorMiFact, comprobante } = await createOrderApiMiFact(billing);
        saveBillingResponse(comprobante);
    }
}