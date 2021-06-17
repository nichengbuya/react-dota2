import { useEffect } from "react";
import { Word } from "./word";
import "./style.scss";
export default function HeroShow() {
    let container: any;
    useEffect(() => {
        const word = new Word({
            container
        });
        async function addHero(){
            await word.addHero();
        }
        addHero();
    },[]);
    return (
        <div ref={c => container = c} className="container">
        </div>
    )
}