<template>
    <div class="group flex flex-col p-[10px] gap-[8px] bg-[#F4F6FA] rounded-[10px]">
        <!-- Header -->
        <div class="flex justify-between">
            <div class="flex gap-[15px] items-center">
                <div class="flex gap-[5px] items-center">
                    <img class="w-[20px] h-[20px] rounded-full" :src="userAvatar" alt="" />
                    <div class="text-[12.5px] font-medium font-['Inter_Tight'] leading-5 text-[#0069FE]">
                        {{ userName }}
                    </div>
                </div>
                <div class="text-xs font-medium font-['Inter_Tight'] leading-5 text-[#7D91A6]">
                    {{ formattedTime }}
                </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-[3px] cursor-pointer select-none opacity-0 group-hover:opacity-100">
                <img class="w-[18px] h-[18px] icon-hover-blue" src="/icon/icon-note.svg" alt="" />
                <img class="w-[18px] h-[18px] icon-hover-red" src="/icon/icon-trash.svg" alt="" />
                <img class="w-[18px] h-[18px] icon-hover-yellow" src="/icon/icon-pin.svg" alt="" />
            </div>
        </div>

        <!-- Referenced message content -->
        <div v-if="note.content" class="bg-blue-600/10 rounded-[8px]">
            <div class="px-3 py-2 text-Text-Neutral-500 text-sm font-medium font-['Inter'] leading-4 cursor-pointer">
                {{ note.content }}
            </div>
        </div>

        <!-- Note text -->
        <div>{{ note.note }}</div>
    </div>
</template>

<script>
export default {
    name: 'NoteItem',

    props: {
        note: {
            type: Object,
            required: true
        },
        listUser: {
            type: Array,
            default: () => []
        }
    },

    computed: {
        user() {
            return this.listUser.find(user => user.id === this.note.user_id)
        },

        userName() {
            return this.user?.full_name || 'Unknown'
        },

        userAvatar() {
            return this.user?.avatar || ''
        },

        formattedTime() {
            if (!this.note.created_at) return ''
            const date = moment(this.note.created_at)
            const now = moment()

            if (date.isSame(now, 'day')) {
                return date.format('HH:mm:ss')
            }

            return date.format('HH:mm DD/MM/YYYY')
        }
    }
}
</script>
