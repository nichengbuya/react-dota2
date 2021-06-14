import { useEffect } from "react";
import { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import AblityTab from "../../../component/ability-tab";
import HeroShow from '../../../component/hero-show';
import HeroService from '../../../service/hero.service';
import './style.scss';
export interface Abilities {
    cooldowns: number[];
    desc_loc: string;
    id: number;
    img: string;
    lore_loc: string;
    mana_costs: number[];
    name_loc: string;

}
export interface Talents {
    behavior: string;
    id: number;
    name: string;
    name_loc: string;
    special_values: { name: string,  values_int: number[], is_percentage: boolean}[]

}
export interface Hero {
    abilities: Abilities[];
    bio_loc: string;
    hype_loc: string;
    id: number;
    name_english_loc: string;
    name_loc: string;
    talents: Talents[];
}
interface HeroDetailProp extends RouteComponentProps{

}
export default function HeroDetail(props:HeroDetailProp) {
    const {match} = props;
    const [heroDetail, setHeroDetail] = useState<Hero>();
    useEffect(()=>{
        async function getHeroDetail(id:number){
            const heroService = new HeroService();
            const res = await heroService.getHeroDetail(id);
            setHeroDetail(res);
        }
        getHeroDetail(Number((match.params as any).id))
    },[])
    return (
        <div className="hero-detail-container">
            <div className="hero-detail-container-item">
                <HeroShow ></HeroShow>
            </div>
            <div className="hero-detail-container-item">
            {
                heroDetail? <AblityTab data={heroDetail.abilities}></AblityTab>:''
            }
            </div>

        </div>
    )
}