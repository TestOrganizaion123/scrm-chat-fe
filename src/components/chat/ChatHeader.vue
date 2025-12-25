<template>
    <div class="min-h-[76px] px-5 py-3 bg-white border-b border-[#e4e6eb] flex justify-between items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10">
        <div class="flex items-center gap-3">
            <!-- Avatar -->
            <div class="relative">
                <img
                    v-if="conversation.thread_avatar"
                    :src="conversation.thread_avatar"
                    alt=""
                    class="w-10 h-10 rounded-full object-cover"
                />
                <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold text-xl">
                    <img
                        v-if="contactAvatar"
                        :src="contactAvatar"
                        alt=""
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <span v-else>{{ avatarText }}</span>
                </div>
            </div>

            <!-- Name -->
            <div>
                <div class="font-bold text-[1.05rem] text-[#050505]">
                    {{ displayName }}
                </div>
            </div>
        </div>

        <!-- Actions slot -->
        <slot name="actions"></slot>
    </div>
</template>

<script>
export default {
    name: 'ChatHeader',

    props: {
        conversation: {
            type: Object,
            required: true
        }
    },

    computed: {
        displayName() {
            return this.conversation.thread_name ||
                this.conversation.contacts[0]?.display_name ||
                'Không tên'
        },

        contactAvatar() {
            return this.conversation.contacts[0]?.avatar_url
        },

        avatarText() {
            return this.conversation.contacts[0]?.display_name?.charAt(0) || 'A'
        }
    }
}
</script>
