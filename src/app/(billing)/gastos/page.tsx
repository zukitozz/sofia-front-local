import { Title } from "@/components";
import GastosTable from "./table";

export default function Gastos() {
    return (
        <div className="flex justify-center items-center mb-7 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title title={`Mantenimiento de gastos`} />  
                <div className='bg-white rounded-lg mx-4 p-4'>
                    <GastosTable 
                        page={ 1 }
                        perPage={ 10 }
                    />
                </div>
                <div id="modal-root"></div>
            </div>
        </div>
    );
}