<template>
    <div v-if="attachment">
        <!-- Image -->
        <div v-if="attachment.type === 'image'">
            <img :src="attachment.href" alt="" class="max-w-full rounded" />
        </div>

        <!-- File -->
        <div v-else-if="attachment.type === 'file'">
            <a
                :href="attachment.href"
                download
                class="text-[0.95rem] leading-[1.4] text-blue-600 hover:underline"
            >
                {{ attachment.href }}
            </a>
        </div>

        <!-- Video -->
        <div v-else-if="attachment.type === 'video'">
            <video :src="attachment.href" controls class="w-full h-auto rounded"></video>
        </div>

        <!-- Voice -->
        <div v-else-if="attachment.type === 'voice'">
            <VoiceMessage :src="attachment.href" />
        </div>
    </div>
</template>

<script>
import VoiceMessage from '@/components/VoiceMessage.vue'

export default {
    name: 'MessageAttachment',

    components: {
        VoiceMessage
    },

    props: {
        attachment: {
            type: Object,
            default: null
        }
    }
}
</script>
