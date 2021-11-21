import MyNavLink from "../../component/my-nav-link";
import RouterView from "../../routers/router-view";


export function Shader(prop:any){
    return(
        <div>
            <MyNavLink  to={`/shader/intersect`}>intersect</MyNavLink>
            <RouterView routes={prop.routes}></RouterView> 
        </div>
    )
}