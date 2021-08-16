import RouterView from "../../routers/router-view";


export function Shader(prop:any){
    return(
        <div>
            <RouterView routes={prop.routes}></RouterView> 
        </div>
    )
}