
import { Switch, RouteProps, Route, Redirect } from 'react-router-dom';
import Head from '../component/head/head';
import Hero from '../view/hero/hero';
import HeroDetail from '../view/hero/hero-detail/hero-detail';
import Home from '../view/home/home';
import Login from '../view/login';

import './style.scss'
const links = [
    'home',
    'hero'
]
const routes: Array<RouteProps> = [
    {
        component: Home,
        path: '/home',
        exact: true
    },
    {
        component: Login,
        path: '/path',
        exact: true
    },
    {
        component: Hero,
        path: '/hero',
        exact: true,
    },
    {
        component: HeroDetail,
        path: '/heroDetail/:id',
        exact: true,
    }
]
export function renderRoute(routes: Array<RouteProps>) {
    return routes.map((route, index) => {
        const { component: Component, children, ...rest } = route;
        return (
            <Route {...rest} key={index} render={(props) => {
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
export default function Routers() {
    return (
        <div className="full-screen">
            <Head data={links}></Head>
            <div className="container">
                <Switch>
                    {renderRoute(routes)}
                    <Redirect to="/home"></Redirect>
                </Switch>
            </div>

        </div>
    )
}