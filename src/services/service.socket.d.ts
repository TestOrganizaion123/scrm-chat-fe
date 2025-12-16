declare class SocketService {
    socket: any
    isConnected: boolean
    connect(token: string): any
    joinPage(pageId: any): void
    leavePage(pageId: any): void
    onConversationUpdated(callback: (data: any) => void): void
    disconnect(): void
    getSocket(): any
}

declare const _default: SocketService
export default _default
