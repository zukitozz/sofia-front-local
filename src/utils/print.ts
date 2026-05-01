import { Printer, Model, WebUSB } from 'escpos-buffer';
interface Props{
    bytes : Uint8Array;
}
export const Print = async ({ bytes }: Props) => {
    try {
        const devices = await navigator.usb.getDevices();
        console.log(devices);
        const device = devices.find(device => device.serialNumber === "4D5844469342840000");

        if(device){
            await device.open();
            await device.selectConfiguration(1);
            await device.claimInterface(0);
            await device.transferOut(1, bytes as any);   
            await device.close(); 
        }
        console.log(device);
    
    } catch (error) {
      console.error('Printing failed', error);
    }    
}