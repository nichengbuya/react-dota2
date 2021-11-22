import { useEffect } from "react";
import World from "../../hooks/use-world"

export default function IntersectHighlights(){
   
    
    useEffect(()=>{
        setTimeout(() => {
            World('world') as any ;
        }, 0);
 

        return()=>{
        }
    },[])
    return (
        <div id='world' style={{width:'100%', height:'calc(100% - 96px)',position:'absolute'}}>

        </div>
    )
}