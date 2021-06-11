import { Fragment } from 'react';
import {  Switch, RouteProps, Route, Redirect } from 'react-router-dom';
import Head from '../component/head/head';
import Hero from '../view/hero/hero';
// import HeroDetail from '../view/hero/hero-detail/hero-detail';
import { Home } from '../view/home/home';
import Login from '../view/login';
const links = [
    'home',
    'hero'
]
const routes:Array<RouteProps> = [
    {
        component:Home,
        path:'/home',
        exact:true
    },
    {
        component:Login,
        path:'/path',
        exact:true
    },
    {
        component:Hero,
        path:'/hero',
        exact:true,
        // children:[
        //     {
        //         component: HeroDetail,
        //         path:'/hero/:heroId',
        //         exact:true 
        //     }
        // ]
    }
]
export function renderRoute(routes:Array<RouteProps>){
    return routes.map((route,index)=>{
        const {component:Component,children,...rest} = route;
        return (
            <Route {...rest} key={index} render={(props)=>{
                return Component && (
                    <Component {...props}>
                      {
                        children && renderRoute(children as Array<RouteProps>)
                      }
                    </Component>
                )
            }}></Route>
        )
    })
}
export default function Routers(){
    return(
        <Fragment>
            <Head data={links}></Head>
            <Switch>
                {renderRoute(routes)}
                <Redirect to="/home"></Redirect>
            </Switch>
        </Fragment>


    )
}