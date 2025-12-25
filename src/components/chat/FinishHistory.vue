<template>
    <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-[10px]">
        <div
            v-for="(message, index) in messages"
            :key="message.id"
            class="flex flex-col gap-4 bg-slate-100 p-3 rounded-[8px]"
        >
            <!-- Header -->
            <div class="flex items-center gap-3">
                <div class="text-[13px] font-medium text-[#039855]">
                    Đã kết thúc lần {{ index + 1 }}
                </div>
                <div class="flex items-center gap-1.5">
                    <img
                        class="w-5 h-5 rounded-full object-cover"
                        :src="getUserAvatar(message.created_by)"
                        alt=""
                    />
                    <div class="text-[13px] font-medium text-[#0069FE]">
                        {{ getUserName(message.created_by) }}
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="text-[13px] font-medium text-[#7D91A6] bg-blue-600/10 px-3 py-1 rounded-[8px]">
                {{ message?.content }}
            </div>

            <!-- Timestamps -->
            <div class="flex flex-col gap-3">
                <div class="bg-[#d1fadf] px-3 py-1 rounded-full text-sm font-medium w-fit">
                    Bắt đầu: {{ formatTime(message?.start_created_at) }}
                </div>
                <div class="bg-[#d1fadf] px-3 py-1 rounded-full text-sm font-medium w-fit">
                    Kết thúc: {{ formatTime(message?.end_created_at) }}
                </div>
            </div>

            <!-- Products -->
            <div v-for="product in message?.product" :key="product.id">
                <div class="bg-[#d1fadf] px-3 py-1 rounded-full text-sm font-medium w-fit">
                    {{ product }}
                </div>
            </div>
        </div>

        <!-- Empty state -->
        <div v-if="!messages.length" class="text-center text-gray-500 py-8">
            Chưa có lịch sử kết thúc
        </div>
    </div>
</template>

<script>
export default {
    name: 'FinishHistory',

    props: {
        messages: {
            type: Array,
            default: () => []
        },
        listUser: {
            type: Array,
            default: () => []
        }
    },

    methods: {
        getUserName(user_id) {
            return this.listUser.find(user => user.id === user_id)?.full_name || 'Unknown'
        },

        getUserAvatar(user_id) {
            return this.listUser.find(user => user.id === user_id)?.avatar || ''
        },

        formatTime(date_string) {
            if (!date_string) return ''
            const date = moment(date_string)
            const now = moment()

            if (date.isSame(now, 'day')) {
                return date.format('HH:mm:ss')
            }

            return date.format('HH:mm DD/MM/YYYY')
        }
    }
}
</script>
