<template>
    <div class="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div class="bg-black rounded-[24px] p-8 flex flex-col items-center gap-6 w-[320px] shadow-2xl animate-fade-in">
            <!-- Recording Animation -->
            <div class="relative w-24 h-24 flex items-center justify-center">
                <div class="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                <div class="absolute inset-0 bg-red-500/30 rounded-full animate-pulse"></div>
                <div class="relative w-16 h-16 bg-[#ff0000] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.4)]">
                    <img src="/icon/icon-voiced.svg" class="w-8 h-8 brightness-0 invert" alt="Mic" />
                </div>
            </div>

            <!-- Timer -->
            <div class="text-white text-2xl font-bold font-mono tracking-wider">
                {{ formatTime(duration) }}
            </div>

            <!-- Actions -->
            <div class="flex flex-col w-full gap-3">
                <div class="flex gap-3 w-full">
                    <button class="flex-1 py-2.5 px-4 bg-white text-black font-semibold rounded-[8px] hover:bg-gray-100 transition-colors cursor-pointer" @click="cancelRecording">Cancel</button>
                    <button class="flex-1 py-2.5 px-4 bg-[#0084ff] text-white font-semibold rounded-[8px] hover:bg-[#0073e6] transition-colors flex items-center justify-center gap-2 cursor-pointer" @click="stopAndSend(false)" :disabled="isUploading">
                        <span v-if="isUploading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span v-else>Send</span>
                    </button>
                </div>

                <!-- <button class="w-full py-2.5 px-4 bg-[#0084ff] text-white font-semibold rounded-[8px] hover:bg-[#0073e6] transition-colors cursor-pointer" @click="stopAndSend(true)" :disabled="isUploading">Send and Save</button> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['socialId', 'folderId'],
    data() {
        return {
            mediaRecorder: null,
            audioChunks: [],
            startTime: null,
            duration: 0,
            timerInterval: null,
            isUploading: false
        }
    },
    mounted() {
        this.startRecording()
    },
    beforeUnmount() {
        this.stopTimer()
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop()
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop())
        }
    },
    methods: {
        async startRecording() {
            try {
                this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                this.mediaRecorder = new MediaRecorder(this.stream)

                this.mediaRecorder.ondataavailable = event => {
                    this.audioChunks.push(event.data)
                }

                this.mediaRecorder.start()
                this.startTimer()
            } catch (error) {
                console.error('Error accessing microphone:', error)
                alert('Không thể truy cập microphone. Vui lòng kiểm tra quyền truy cập.')
                this.$emit('close')
            }
        },
        startTimer() {
            this.startTime = Date.now()
            this.timerInterval = setInterval(() => {
                this.duration = Math.floor((Date.now() - this.startTime) / 1000)
            }, 1000)
        },
        stopTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval)
                this.timerInterval = null
            }
        },
        cancelRecording() {
            this.stopTimer()
            if (this.mediaRecorder) {
                this.mediaRecorder.stop()
            }
            this.$emit('close')
        },
        stopAndSend(save = false) {
            this.stopTimer()
            if (!this.mediaRecorder) return

            this.isUploading = true

            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/mp3' })
                await this.uploadAndSend(audioBlob, save)
            }

            this.mediaRecorder.stop()
        },
        async uploadAndSend(blob, save) {
            const formData = new FormData()
            formData.append('file', blob, 'voice_message.mp3')

            try {
                const res = await api({
                    url: '/scrm/chat/upload-voice',
                    method: 'POST',
                    data: formData
                })

                if (res.success) {
                    this.$emit('close')
                } else {
                    alert(res.message || 'Upload failed')
                    this.isUploading = false
                }
            } catch (error) {
                console.error('Upload error:', error)
                alert('Có lỗi xảy ra khi gửi tin nhắn thoại')
                this.isUploading = false
            }
        },
        formatTime(seconds) {
            const mins = Math.floor(seconds / 60)
            const secs = seconds % 60
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
    }
}
</script>
