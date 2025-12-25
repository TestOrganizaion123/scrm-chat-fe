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
        component: () => import('@/pages/AuthCrm.vue'),
        meta: { guest: true }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Navigation guard - Check authentication
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('accessToken')
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isGuestRoute = to.matched.some(record => record.meta.guest)

    // Nếu route yêu cầu auth nhưng chưa có token -> redirect to /auth
    if (requiresAuth && !token) {
        next({ name: 'Auth' })
        return
    }

    // Nếu đã có token và đang ở guest route (auth page) -> redirect to app
    if (isGuestRoute && token) {
        next({ path: '/app/chat' })
        return
    }

    next()
})

export default router
