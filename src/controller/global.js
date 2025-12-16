import axios from 'axios'

Object.assign(window, {
    setSession: (key, value) => {
        if (process.env.NODE_ENV === 'production') {
            sessionStorage.setItem(key, value)
        } else {
            localStorage.setItem(key, value)
        }
    },

    getSession: key => {
        if (process.env.NODE_ENV === 'production') {
            return sessionStorage.getItem(key)
        } else {
            return localStorage.getItem(key)
        }
    },

    removeSession: key => {
        if (process.env.NODE_ENV === 'production') {
            sessionStorage.removeItem(key)
        } else {
            localStorage.removeItem(key)
        }
    },

    api: async ({ url, data = {}, method = 'GET', params, headers = {} }) => {
        let host = location.protocol + '//gateway.' + location.hostname.split('.').slice(-2).join('.')
        let is_form_data = data instanceof FormData

        return axios({
            url: host + url,
            method,
            data: is_form_data ? data : JSON.stringify(data),
            headers: {
                ...(is_form_data ? {} : { 'Content-Type': 'application/json' }),
                authorization: 'Bearer ' + getSession('accessToken'),
                ...headers
            },
            params,
            withCredentials: true
        })
            .then(res => res.data)
            .catch(e => {
                let message = e?.response?.data?.message || 'Lỗi không xác định! Vui lòng thử lại sau'
                let subcode = e?.response?.data?.subcode || 'unknown'
                return { error: true, message, subcode }
            })
    }
})
