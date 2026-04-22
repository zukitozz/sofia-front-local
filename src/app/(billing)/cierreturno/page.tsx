import { Title } from "@/components";
import CierreVentas from './ventas';
import { Historico } from "./historico";

export default function Cierreturno() {

    return (
        <div className="flex justify-center items-center mb-7 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title title={`Cierre de turno`} />
                <div className="grid grid-cols-6 sm:grid-cols-6 gap-10">
                    <Historico/>
                    <CierreVentas/>
                </div>
            </div>
        </div>
    );
        
    
}