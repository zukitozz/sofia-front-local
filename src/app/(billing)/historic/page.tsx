import { Title } from "@/components";
import HistoricosTable from "./table";


export default function Products() {
    return (
        <div className="flex justify-center items-center mb-7 px-10 sm:px-0">
            <div className="flex flex-col w-[1500px]">
                <Title title={`Histórico de comprobantes`} />  
                <div className='bg-white rounded-lg mx-4 p-4'>
                    <HistoricosTable 
                        page={ 1 }
                        perPage={ 20 }
                    />
                </div>
                <div id="modal-root"></div>
            </div>
        </div>
    );
}