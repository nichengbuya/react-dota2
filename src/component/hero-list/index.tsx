import { RouteComponentProps, withRouter } from 'react-router-dom';
import Search from '../search';

import './style.scss';
export interface Hero {
    complexity: number;
    id: number;
    index_img: string;
    name: string;
    name_english_loc: string;
    name_loc: string;
    primary_attr: number;
}
interface HeroListProp extends RouteComponentProps{
    data:Hero[]
}
function HeroList (props:HeroListProp ) {
    const {data , history} = props;
    const heroList = data.map((i,index)=>{
        return (
            <div key={index} className="hero-card" style={{backgroundImage:`url(${i.index_img})`}} 
                onClick={()=>{history.push(`heroDetail/${i.id}`)}}
            >
                <div className="hero-discribe">{i.name_loc}</div>
            </div>
        )
    })



    return (
        <div className="hero-list">
            <Search></Search>
            {heroList}
        </div>
    )
}

export default withRouter(HeroList)