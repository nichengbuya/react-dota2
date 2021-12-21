import { useCallback, MouseEvent,useMemo, useState } from "react";
import './style.scss';
const POSITION = {x:0,y:0}
export default function DragList(){
    const initList = ()=>{
        return Array.from({length:10},(x,i)=> x = i)
    }
    const [list, setList]=useState(initList());
    const [dragState, setDragState]= useState({
        isDragging:false,
        translation:POSITION,
        origin:POSITION,
        dragIndex:-1
    })
    const handleMouseDown = (prop: { e: MouseEvent; index: number; })=>{
        const {e,index} = prop;
        const {clientX ,clientY}= e;
        e.preventDefault();
        const origin = {x:clientX, y:clientY};
        setDragState(state=>({
            ...state,
            isDragging:true,
            origin,
            dragIndex:index
        }))

    }  
    const handleMouseMove = useCallback((e)=>{
        const {clientX ,clientY}= e;
        const translation = {x:clientX - dragState.origin.x ,y: clientY - dragState.origin.y};

        setDragState(state=>({
            ...state,
            isDragging:true,
            translation
        }))
    },[dragState])  

    const handleMouseUp = useCallback(()=>{
        setDragState(state=>({
            ...state,
            isDragging:false,
            
        }))
    },[])  
    const getDraggingStyle = (i:number) => {
        if (i !== dragState.dragIndex) return {};
        return {
            cursor:`${dragState.isDragging?'grabbing':'grab'}`,
            backgroundColor: '#ccc',
            transform: `translate(${dragState.translation.x}px, ${dragState.translation.y}px)`,
            transition: `${dragState.isDragging?'null':'500ms'}`,
        };
      };
      

    return (
        <div className='drag-list'>
            <ul >
                {
                    list.map((i,index)=>{
                        return <li key={index} style={{
                            cursor:`${dragState.isDragging?'grabbing':'grab'}`
                        }}  onMouseDown={(e)=>handleMouseDown({e,index})}>{i}</li>
                    })
                }
            </ul>
            {
                dragState.isDragging && <div className='drag-list-mask' onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></div>
            }
        </div>
    )

}