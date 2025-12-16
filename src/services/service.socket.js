import { io } from 'socket.io-client'

class SocketService {
    constructor() {
        this.socket = null
        this.isConnected = false
    }

    connect(token) {
        const SOCKET_URL = 'gateway.' + location.hostname.split('.').slice(-2).join('.')

        this.socket = io(SOCKET_URL, {
            path: '/realtime',
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        })

        this.socket.on('connect', () => {
            console.log('Socket connected successfully:', this.socket.id)
            this.isConnected = true
        })
        this.socket.on('disconnect', reason => {
            console.log('Socket disconnected:', reason)
            this.isConnected = false
        })
        this.socket.on('connect_error', error => {
            console.error('Socket connection error:', error.message)
        })
        this.socket.on('error', error => {
            console.error('Socket error:', error)
        })

        return this.socket
    }

    // Join page room
    joinPage(pageId) {
        if (this.socket) {
            this.socket.emit('call', 'sCRMChatJoinPage', { pageIds: [pageId] }, (err, res) => {})
        }
    }

    // Leave page room
    leavePage(pageId) {
        if (this.socket) {
            this.socket.emit('call', 'sCRMChatLeavePage', { pageIds: [pageId] })
        }
    }

    // Lắng nghe conversation được update
    onConversationUpdated(callback) {
        if (this.socket) {
            this.socket.on('conversation_updated', callback)
        }
    }

    // Ngắt kết nối
    disconnect() {
        if (this.socket) {
            this.socket.disconnect()
            this.socket = null
            this.isConnected = false
        }
    }

    getSocket() {
        return this.socket
    }
}

// Export singleton instance
export default new SocketService()
