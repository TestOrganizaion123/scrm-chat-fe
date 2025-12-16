declare module '@/services/service.socket' {
    export interface SocketService {
        socket: any
        isConnected: boolean
        connect(token: string): any
        joinPage(pageId: any): void
        leavePage(pageId: any): void
        onConversationUpdated(callback: (data: any) => void): void
        disconnect(): void
        getSocket(): any
    }

    const instance: SocketService
    export default instance
}
