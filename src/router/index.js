/**
 * router/index.js
 * Vue Router configuration
 */

import { createRouter, createWebHistory } from 'vue-router'

// Layouts
const DashboardLayout = () => import('@/layouts/DashboardLayout.vue')

// Views
const AppChat = () => import('@/pages/AppChat.vue')
const NotFound = () => import('@/pages/NotFound.vue')

const routes = [
    {
        path: '/',
        component: DashboardLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: '/app/chat'
            },
            {
                path: 'app/chat',
                name: 'AppChat',
                component: AppChat
            },
            {
                path: 'business',
                name: 'Business',
                component: NotFound
            },
            {
                path: 'revenue',
                name: 'Revenue',
                component: NotFound
            },
            {
                path: 'issues',
                name: 'Issues',
                component: NotFound
            },
            {
                path: 'subscribers',
                name: 'Subscribers',
                component: NotFound
            },
            {
                path: 'campaigns',
                name: 'Campaigns',
                component: NotFound
            },
            {
                path: 'vouchers',
                name: 'Vouchers',
                component: NotFound
            },
            {
                path: 'contacts',
                name: 'Contacts',
                component: NotFound
            },
            {
                path: 'opportunities',
                name: 'Opportunities',
                component: NotFound
            },
            {
                path: 'employees',
                name: 'Employees',
                component: NotFound
            },
            {
                path: 'settings',
                name: 'Settings',
                component: NotFound
            },
            {
                path: 'approvals',
                name: 'Approvals',
                component: NotFound
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: '/auth',
        name: 'Auth',
        component: () => import('@/pages/AuthCrm.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Navigation guard - Tạm thời bỏ qua auth để test UI
router.beforeEach((to, from, next) => {
    // const token = getToken()
    // const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    // const isGuestRoute = to.matched.some(record => record.meta.guest)

    // if (requiresAuth && !token) {
    //   next({ name: 'Login', query: { redirect: to.fullPath } })
    //   return
    // }

    // if (isGuestRoute && token) {
    //   next({ name: 'Platforms' })
    //   return
    // }

    next()
})

export default router
