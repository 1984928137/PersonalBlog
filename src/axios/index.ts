import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import LocalCache from './cache';
import { useRouter } from 'vue-router'
import { ElLoading } from 'element-plus'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'
// import type{Router} from 'vue-router'
import { ElMessage } from 'element-plus'

// const router = useRouter()

const DEFAULT_LOADING = true

enum MESSAGE {
    "操作成功" = 200,
    "密码错误" = 201,
    "帐号错误" = 202,
    "请求错误" = 203,
    "token错误" = 401
}

interface EXRequestInterceptors<T = AxiosResponse> {
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestInterceptorCatch?: (error: any) => any
    responseInterceptor?: (res: T) => T
    responseInterceptorCatch?: (error: any) => any
}

interface EXTRequestConfig<T = AxiosResponse> extends AxiosRequestConfig{
    interceptors?: EXRequestInterceptors
    showLoading?: boolean,
}



class EXRequest{
    instance: AxiosInstance
    interceptors?: EXRequestInterceptors
    showLoading: boolean
    loading?: LoadingInstance

    constructor(config: EXTRequestConfig) {
        // 创建axios实例
        this.instance = axios.create(config)
        // 保存基本信息
        this.showLoading = config.showLoading ?? DEFAULT_LOADING

        this.interceptors = config.interceptors
        // 从config中取出的拦截器是对应的实例的拦截器
        this.instance.interceptors.request.use(
            this.interceptors?.requestInterceptor,
            this.interceptors?.requestInterceptorCatch
        )

        this.instance.interceptors.response.use(
            this.interceptors?.responseInterceptor,
            this.interceptors?.responseInterceptorCatch
        )
        // 添加所有的实例都有的拦截器
        this.instance.interceptors.request.use(
            (config) => {
                console.log('所有的实例都有的拦截器: 请求成功拦截')
                config.headers = config.headers || {}
                if (this.showLoading) {
                    this.loading = ElLoading.service({
                        lock: true,
                        text: '正在请求数据....',
                        background: 'rgba(255, 255, 255, 0.5)',
                        spinner: 'el-icon-loading'
                    })
                }
                // if (localStorage.getItem('token') && localStorage.getItem('token') != 'undefined') {
                //     // console.log(localStorage.getItem('token'))
                //     config.headers.Authorization = "Bearer " + (localStorage.getItem('token') || '')
                // }
                // const token = LocalCache.getCache('token')
                // if (token) {
                //     config.headers.Authorization = `Bearer ${token}`
                // }
                return config
            },
            (err) => {
                console.log('所有的实例都有的拦截器: 请求失败拦截')
                return err
            }
        )

        this.instance.interceptors.response.use(
            (res) => {
                console.log('所有的实例都有的拦截器: 响应成功拦截')

                // 将loading移除
                this.loading?.close()
                const code: number = res.status
                // console.log('响应成功的状态码',code,res)
                if (code !== 200) {
                    ElMessage.error(MESSAGE[code])
                    return res.data
                }
                // ElMessage({
                //     message: 'Congrats, this is 获取成功.',
                //     type: 'success',
                // })
                return res.data
            },
            (err) => {
                console.log('所有的实例都有的拦截器: 响应失败拦截')
                // 将loading移除
                this.loading?.close()

                // 例子: 判断不同的HttpErrorCode显示不同的错误信息
                if (err.response.status === 404) {
                    console.log('无法找到网页')
                }
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
                return err
            }
        )
    }
    request<T>(config: EXTRequestConfig): Promise<T> {
        return new Promise((resolve, reject) => {
            
            if (config.interceptors?.requestInterceptor) {
                config = config.interceptors.requestInterceptor(config)
            }

            //判断是否需要显示loading
            if (config.showLoading === false) {
                this.showLoading = config.showLoading
            }
            
            this.instance
                .request<any, T>(config)
                .then((res) => {
                    // 将showLoading设置true, 这样不会影响下一个请求
                    this.showLoading = DEFAULT_LOADING

                    // 将结果resolve返回出去
                    resolve(res)
                })
                .catch((err) => {
                    // 将showLoading设置true, 这样不会影响下一个请求
                    this.showLoading = DEFAULT_LOADING
                    reject(err)
                    return err
                })
        })
    }

    get<T>(config: EXTRequestConfig<T>): Promise<T> {
        return this.request<T>({ ...config, method: 'GET' })
    }

    post<T>(config: EXTRequestConfig<T>): Promise<T> {
        return this.request<T>({ ...config, method: 'POST' })
    }

    put<T>(config: EXTRequestConfig<T>): Promise<T> {
        return this.request<T>({ ...config, method: 'PUT' })
    }

    delete<T>(config: EXTRequestConfig<T>): Promise<T> {
        return this.request<T>({ ...config, method: 'DELETE' })
    }

    patch<T>(config: EXTRequestConfig<T>): Promise<T> {
        return this.request<T>({ ...config, method: 'PATCH' })
    }

}

// 响应拦截

// $http.interceptors.response.use(res => {
//     const code: number = res.status
//     if (code !== 200) {
//         ElMessage.error(MESSAGE[code])
//         return Promise.reject(res.data)
//     }
//     ElMessage({
//         message: 'Congrats, this is 获取成功.',
//         type: 'success',
//     })
//     return res.data
// },
//     err => {
//         if (err.response.status == 401) {
//             ElMessage.error('Token错误，请重新登录帐号')
//             localStorage.removeItem('token')
//             // router.replace('/login')
//             console.log('401跳转', err)
//             return
//         } else {
//             ElMessage.error('错误，数据获取失败，请检查你的网络是否正常')
//             console.log(err)
//         }

//     })

export default EXRequest
