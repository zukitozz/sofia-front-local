import { Title } from "@/components";
import CierreSection from "./table";

export default function Cierredia() {
    return(
            <div className="flex justify-center items-center mb-7 px-10 sm:px-0">
                <div className="flex flex-col w-[1000px]">
                    <Title title={`Cierre de día`} />
                    <CierreSection page={0} perPage={0}/>
                </div>
            </div>
    )
}