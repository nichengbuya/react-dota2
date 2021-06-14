import { useEffect, useState } from "react";
import { Word } from "./word";
import "./style.scss";
export default function HeroShow() {
    let container: any;
    useEffect(() => {
        const word = new Word({
            container
        });
        word.addMesh();

    },[]);
    return (
        <div ref={c => container = c} className="container">
        </div>
    )
}