import { useEffect, useState } from "react";
import HeroService from '../../service/hero.service';
import HeroList from '../../component/hero-list'
export default function Hero(){
    const [heroList, setHeroList] = useState([]);
    useEffect(() => {
        async function fetchData(){
            const heroService = new HeroService();
            const res = await heroService.getHeroList();
            setHeroList(res)
        }
        fetchData();
      },[]);
    return(
        <div>
            <HeroList data={heroList}></HeroList>
        </div>
    )
}