import axios from 'axios';
import { useRouter } from 'vue-router'
// import type{Router} from 'vue-router'
import { ElMessage } from 'element-plus'

// const router = useRouter()

enum MESSAGE {
    "操作成功" = 200,
    "密码错误" = 201,
    "帐号错误" = 202,
    "请求错误" = 203,
    "token错误" = 401
}



const $http = axios.create({
    baseURL: 'http://120.78.133.68:3000',
    timeout: 3000,
    headers: {
        'Content-Type': "application/json;charset=utf-8"
    }
})

// 请求拦截

$http.interceptors.request.use(config => {
    config.headers = config.headers || {}

    if (localStorage.getItem('token') && localStorage.getItem('token') != 'undefined') {
        // console.log(localStorage.getItem('token'))
        config.headers.Authorization = "Bearer " + (localStorage.getItem('token') || '')
    }
    return config
})

// 响应拦截

$http.interceptors.response.use(res => {
    const code: number = res.status
    if (code !== 200) {
        ElMessage.error(MESSAGE[code])
        return Promise.reject(res.data)
    }
    ElMessage({
        message: 'Congrats, this is 获取成功.',
        type: 'success',
    })
    return res.data
},
    err => {
        if (err.response.status == 401) {
            ElMessage.error('Token错误，请重新登录帐号')
            localStorage.removeItem('token')
            // router.replace('/login')
            console.log('401跳转', err)
            return
        } else {
            ElMessage.error('错误，数据获取失败，请检查你的网络是否正常')
            console.log(err)
        }

    })

export {
    $http
}