import MyNavLink from "../myNavLink"
import './style.scss';
interface HeadProp{
    data:string[]
}
export default function Head(props:HeadProp) {
    const {data} = props
    const headList = data.map((i,index)=>{
        return <MyNavLink key={index} to={`/${i}`}>{i}</MyNavLink>
    })
    return (
        <div className="head">
            {headList}
        </div>
    )
}