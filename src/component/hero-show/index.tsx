import { useEffect } from "react";
import  World  from "./world";
export default function HeroShow() {
    let container: any;
    useEffect(() => {
        const word = new World({
            container
        });
        async function addHero(){
            await word.addHero();
        }
        addHero();
        return ()=>{
            word.unload();
        }
    },[container]);
    return (
        <div ref={c => container = c} className="container">
        </div>
    )
}