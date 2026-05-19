"use client";
import useSWR from "swr";
import { Title } from "@/components";
import { getHistoricoById } from "@/actions/historicos/get-historicos";
import { BillingEditForm } from "./ui/BillingEditForm";
import { BillingEditSummary } from "./ui/BillingEditSummary";

interface Props {
  params: {
    id: number;
  };
}

const fetcher = (id: number) => getHistoricoById(id);

export default function InvoiceByIdPage({ params }: Props) {
    const { id } = params;
    const { data, error, isValidating, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_URL}/api`, (url: string) => fetcher(id));

    if(!data || isLoading || isValidating || error){
        return (<div className="animate-spin rounded-full h-8 w-8 justify-center border-gray-900 border-b-2 align-middle"></div>);
    }     

    return (
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
            <Title title={`Detalle de la orden`} />
            <div className="grid grid-cols-5 sm:grid-cols-5 gap-10">
                <div className="bg-white rounded-xl shadow-xl p-7 col-span-3">
                    <BillingEditForm billing={data}  />
                </div>  
                <div className="bg-white rounded-xl shadow-xl p-7 col-span-2">
                    <BillingEditSummary billing={data} />
                </div>               
            </div>
        </div>
      </div>
    );
}