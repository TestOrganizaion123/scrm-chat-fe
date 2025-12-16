<template>
    <div class="flex items-center gap-3 bg-[#d1fadf] px-3 py-2 rounded-full w-[280px]">
        <!-- Speed Control -->
        <button class="px-2 py-1 bg-[#bbf7d0] hover:bg-[#86efac] text-[#166534] text-xs font-bold rounded-md transition-colors min-w-[32px]" @click="toggleSpeed">{{ playbackRate }}x</button>

        <!-- Play/Pause Button -->
        <button class="w-8 h-8 flex items-center justify-center text-[#166534] hover:text-[#14532d] transition-colors" @click="togglePlay">
            <i class="fas" :class="isPlaying ? 'fa-pause' : 'fa-play'"></i>
        </button>

        <!-- Progress Bar -->
        <div class="flex-1 h-1.5 bg-[#bbf7d0] rounded-full cursor-pointer relative group" @click="seek">
            <div class="absolute top-0 left-0 h-full bg-[#166534] rounded-full transition-all duration-100" :style="{ width: `${progress}%` }"></div>
            <!-- Hover handle -->
            <div class="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#166534] rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm" :style="{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }"></div>
        </div>

        <!-- Timer -->
        <div class="text-xs font-medium text-[#166534] min-w-[35px] text-right">
            {{ formatTime(currentTime) }}
        </div>

        <!-- Download Button -->
        <a :href="src" download class="text-[#166534] hover:text-[#14532d] transition-colors" target="_blank" @click.stop>
            <i class="fas fa-download"></i>
        </a>

        <audio ref="audioPlayer" :src="src" @timeupdate="updateProgress" @loadedmetadata="onLoadedMetadata" @ended="onEnded"></audio>
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isPlaying: false,
            progress: 0,
            currentTime: 0,
            duration: 0,
            playbackRate: 1
        }
    },
    methods: {
        togglePlay() {
            const audio = this.$refs.audioPlayer
            if (this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
            this.isPlaying = !this.isPlaying
        },
        toggleSpeed() {
            const speeds = [1, 1.5, 2]
            const currentIndex = speeds.indexOf(this.playbackRate)
            this.playbackRate = speeds[(currentIndex + 1) % speeds.length]
            this.$refs.audioPlayer.playbackRate = this.playbackRate
        },
        updateProgress() {
            const audio = this.$refs.audioPlayer
            this.currentTime = audio.currentTime
            this.progress = (audio.currentTime / audio.duration) * 100
        },
        seek(event) {
            const audio = this.$refs.audioPlayer
            const rect = event.currentTarget.getBoundingClientRect()
            const x = event.clientX - rect.left
            const percentage = x / rect.width
            const time = percentage * audio.duration

            audio.currentTime = time
            this.currentTime = time
        },
        onLoadedMetadata() {
            this.duration = this.$refs.audioPlayer.duration
        },
        onEnded() {
            this.isPlaying = false
            this.progress = 0
            this.currentTime = 0
        },
        formatTime(seconds) {
            const mins = Math.floor(seconds / 60)
            const secs = Math.floor(seconds % 60)
            return `${mins}:${secs.toString().padStart(2, '0')}`
        }
    }
}
</script>
