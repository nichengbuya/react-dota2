import { useEffect, useState } from "react";
import HeroService from '../../service/hero.service';
import HeroList from '../../component/heroList'
export default function Hero(){
    const heroService = new HeroService();
    const [heroList, setHeroList] = useState([]);
    useEffect(() => {
        async function fetchData(){
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