/**
 * stores/user.js
 * User store using Pinia
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
    // State
    const user = ref(null)
    const user_crm = ref(null)
    const token = ref(localStorage.getItem('token') || null)
    const listUser = ref([])

    // Getters
    const isLoggedIn = computed(() => !!token.value)
    const userName = computed(() => user.value?.name || 'User')

    // Actions
    const setUser = userData => {
        user.value = userData
    }

    const setUserCrm = userData => {
        user_crm.value = userData
    }

    const setToken = newToken => {
        token.value = newToken
        if (newToken) {
            localStorage.setItem('token', newToken)
        } else {
            localStorage.removeItem('token')
        }
    }

    const setListUser = userData => {
        listUser.value = userData
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
    }

    return {
        // State
        user,
        user_crm,
        token,
        listUser,
        // Getters
        isLoggedIn,
        userName,
        // Actions
        setUser,
        setToken,
        setUserCrm,
        setListUser,
        logout
    }
})

export const verifyOTP = defineStore('verifyOTP', () => {
    const otp = ref(null)

    const setOTP = userData => {
        otp.value = userData
    }

    return {
        otp,
        setOTP
    }
})
