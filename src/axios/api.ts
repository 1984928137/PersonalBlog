import { $http } from './index';
// import * as qs from 'qs'

interface HttpDefault {
    method: string,
    url: string,
    params: unknown,
    data: string | null
}

interface LoginData {
    userName: string,
    password: string
}

const api = function (method: string, url: string, params: LoginData | Object | null) {
    let httpDefault: HttpDefault = {
        method,
        url,
        params: method === 'GET' || method === 'DELETE' ? params : null,
        data: method === 'POST' || method === 'PUT' ? JSON.stringify(params) : null
    }
    return $http(httpDefault)
    // .then(
    //     res =>{
    //         return res.data
    //     }
    // ).catch(err => {
    //     console.log(err)
    // })
}

// 登录请求
const login = (data: LoginData | Object | null) => api('POST', "/users/login", data)

// 商品初始化列表
const productData = (data: LoginData | Object | null) => api('GET', "/api/product", data)

// 商品查询
const productQuire = (data: LoginData | Object | null) => api('POST', "/api/productQuire", data)

// 获取角色列表，例如学生、老师等
const getRole = (data: LoginData | Object | null | string) => api('GET', "/api/getRole", data)

// 用户列表
const getUser = (data: LoginData | Object | null | string) => api('GET', "/api/getUser", data)

const authority = (data: LoginData | object | null | string) => api('GET',"/api/authority",data)

const getRouter = (data: LoginData | object | null | string) => api('GET', "/api/getRouter", data)

export {
    login,
    productData,
    productQuire,
    getRole,
    getUser,
    authority,
    getRouter
}