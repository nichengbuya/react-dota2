import { useState } from "react";
import { Abilities } from "../../view/hero/hero-detail/hero-detail";
import './style.scss';
interface AblityTabProp{
    data:Abilities[]
}
export default function AblityTab(props:AblityTabProp){
    const {data} = props;
    const [cur,setCur] = useState<Abilities>(data[0]);
    const [animation,setAnimation] = useState('');
    const tabList = data.map((i,index)=>{
        return (
            <div key={index} className={`ability-card ${i.id === cur.id?'active':''}`} style={{backgroundImage:`url(${i.img})`}}
                onClick={()=>{setAbility(i)}}
            >
            </div>
        )
    })
    const setAbility = (i:Abilities)=>{
        const cur = data.filter(a=>a.id === i.id)[0];
        setCur(cur);
        setAnimation('animation')
        setTimeout(()=>{
            setAnimation('none')
        },500)

    }
    return (
        <div>
            <div className="tab-list">
                {tabList}
            </div>
            <div className={`content ${animation}`} >
                <h4>{cur.name_loc}</h4>
                {cur.desc_loc}
            </div>
        </div>
    )
}