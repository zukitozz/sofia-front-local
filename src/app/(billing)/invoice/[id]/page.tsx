"use client";
import { Title } from "@/components";
import { BillingForm } from "./ui/BillingForm";
import { BillingSummary } from "./ui/BillingSummary";
import { useOrderAbastecimientoStore } from "@/store";

interface Props {
  params: {
    id: string;
  };
}

export default function InvoiceByIdPage({ params }: Props) {
    const { id } = params;
    const orders = useOrderAbastecimientoStore((state) => state.items);
    const { subTotal, totalIgv, total } = useOrderAbastecimientoStore((state) => state.getSummaryInformation());    
    
    return (
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
            <Title title={`Detalle de la orden`} />
            <div className="grid grid-cols-5 sm:grid-cols-5 gap-10">
                <div className="bg-white rounded-xl shadow-xl p-7 col-span-3">
                    <BillingForm total={total} subTotal={subTotal} totalIgv={totalIgv} orders={orders}/>
                </div>  
                <div className="bg-white rounded-xl shadow-xl p-7 col-span-2">
                    <BillingSummary orderInBilling={orders} subTotal={subTotal} totalIgv={totalIgv} total={total} />
                </div>                
            </div>
        </div>
      </div>
    );
}