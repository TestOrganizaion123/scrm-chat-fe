export const getRelativeTime = date => {
    if (!date) return ''

    const now = new Date()
    const past = new Date(date)
    const diffMs = now - past
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) {
        return 'Vừa xong'
    } else if (diffMins < 60) {
        return `${diffMins} phút trước`
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`
    } else {
        return past.toLocaleDateString('vi-VN')
    }
}

/**
 * Format date to Vietnamese locale
 * @param {Date|string|number} date
 * @param {object} options
 * @returns {string}
 */
export const formatDate = (date, options = {}) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        ...options
    })
}

/**
 * Format time
 * @param {Date|string|number} date
 * @returns {string}
 */
export const formatTime = date => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

/**
 * Debounce function
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}
