import { createApp } from 'vue'
import { router } from '../src/router/index'
import App from './App.vue'

createApp(App)
    .use(router)
    .mount('#app')
