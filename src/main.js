/**
 * main.js
 * Entry point của ứng dụng Vue 3
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Global API setup
import './controller/global'

// Styles
import './assets/main.css'

// Router
import router from './router'

// Stores
import { useUserStore } from './stores/user'
import { verifyOTP } from './stores/user'

// Create app
const app = createApp(App)

// Create Pinia store
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)

const url_dashboard = 'https://dashboard.' + location.hostname.split('.').slice(-2).join('.')

const authentication = async () => {
    const res = await api({
        url: '/public/authentication',
        method: 'get'
    })

    if (!res.isLogin) {
        location.href = url_dashboard + '/signin?referer=' + encodeURIComponent(location.href)
        return
    }

    // Save user data to store
    const userStore = useUserStore()
    userStore.setUser(res)

    const authentication_crm = async () => {
        const resCrm = await api({
            url: '/scrm/public/authentication',
            method: 'get'
        })

        const verifyOTPStore = verifyOTP()
        verifyOTPStore.setOTP(resCrm)

        if (resCrm.isLogin) {
            let list_user = await api({
                url: '/scrm/employee/list',
                method: 'get'
            })

            const userStore = useUserStore()
            const users = Array.isArray(list_user) ? list_user : list_user.data || []
            userStore.setListUser(users)
            userStore.setUserCrm(resCrm.user)
        }
    }

    authentication_crm()
}

authentication()

// Mount app
app.mount('#app')
