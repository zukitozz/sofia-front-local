import { Title } from "@/components";
import ProductTable from "./table";

export default function Products() {
    return (
        <div className="flex justify-center items-center mb-7 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title title={`Mantenimiento de productos`} />  
                <div className='bg-white rounded-lg mx-4 p-4'>
                    <ProductTable 
                        page={ 1 }
                        perPage={ 10 }
                    />
                </div>
                <div id="modal-root"></div>
            </div>
        </div>
    );
}