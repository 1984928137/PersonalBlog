import { createRouter, createWebHistory, RouteLocationRaw, RouteParamValueRaw, RouteRecordRaw, useRouter } from 'vue-router'
import { getRouter } from "../axios/api";
const modules = import.meta.glob('../components/**/**.vue')


// 引入组件

const route = [
    {
        path: '/',
        name: 'home',
        component: () => import("../components/View/HomeView.vue"),
        // meta: { qss: false },
        props: true,
        // redirect: '/productlist',
        
    },
    
    {
        path: '/login',
        name: 'login',
        component: () => import("../components/View/loginView.vue"),
        // meta: { qss: false },
        props: true
    },
    {
        path: '/person',
        name: 'person',
        component: () => import("../components/View/personalView.vue"),
        // meta: { qss: false },
        props: true,
        children:[
            {
                path: '/basic',
                name: 'basic',
                component: () => import("../components/Uncommon/person/basic.vue"),
                // meta: { qss: false },
                props: true
            },
        ]
    },
    {
        path: '/Snake',
        name: 'Snake',
        component: () => import("../components/Uncommon/Snake.vue"),
        meta: { qss: false },
        props: true,

    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: route
})

const InitRouteLength:number = route.length


router.beforeEach(async (to, from) => {
    const token: string | null = localStorage.getItem('token')
    if (to.path !== '/login' && !token) {

        return '/login'
    } else if (to.path !== '/login' && token) {
        if (router.getRoutes().length <= InitRouteLength) {

            const routerData: [] = await getRouter(
                ''
            ).then(
                res => {
                    return res.data.result;
                }
            ).catch(
                err => {
                    console.log('axios-err', err)
                }
            )
            console.log(routerData)
            routerData.forEach((v: any) => {
                const routerArr: RouteRecordRaw = {
                    path: v.path.trim(),
                    meta: {
                        title: v.meta.title.trim(),
                        icon: v.meta.icon.trim(),
                        homeIsShow: v.meta.homeIsShow
                    },
                    name: v.name.trim(),
                    // component: () => import("../components/`${v.component}`.vue")
                    component: modules["../components" + `${v.component}` + ".vue"]
                }
                // router.getRoutes().filter(v => v.name == 'home')[0].children
                router.addRoute('home', routerArr)
            });

            router.getRoutes().filter(v => v.name == 'home')[0].redirect = "/order"
            router.replace(to.path)
            // next({ ...to, replace: true })

        }
    }
    // else if (to.path === '/login' && token) {
    //     // return '/'
    //     // router.replace('/')

    // }
})

export {
    router
}