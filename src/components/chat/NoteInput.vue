<template>
    <div class="p-3 pt-0">
        <div class="relative flex flex-col border border-[#E8EDF2] rounded-[5px] shrink-0">
            <!-- Selected message to note -->
            <div v-if="selectedMessage" class="flex items-center gap-2 px-[10px] py-2">
                <div class="flex flex-1 bg-blue-600/10 items-center justify-between rounded-[5px] pl-[5px] py-1">
                    <div class="text-sm text-gray-600 truncate">
                        {{ selectedMessage.content }}
                    </div>
                    <button
                        @click="$emit('clear-selected')"
                        class="shrink-0 p-1 hover:bg-red-50 rounded"
                    >
                        <img src="/icon/icon-close-red.svg" alt="Close" class="w-4 h-4" />
                    </button>
                </div>
                <div class="shrink-0 p-1 cursor-pointer">
                    <img src="/icon/icon-image.svg" alt="" class="w-5 h-5" />
                </div>
            </div>

            <!-- Textarea with icon -->
            <div class="relative">
                <textarea
                    :value="modelValue"
                    @input="$emit('update:modelValue', $event.target.value)"
                    placeholder="Nhập để ghi chú ( Enter để gửi )"
                    class="w-full h-24 p-[10px] pr-10 scrollbar-thin scrollbar-thumb-[#E8EDF2] border-none outline-none resize-none"
                    @keydown.enter.exact.prevent="$emit('send')"
                ></textarea>

                <div
                    v-if="!selectedMessage"
                    class="absolute top-2 right-2 cursor-pointer"
                >
                    <img src="/icon/icon-image.svg" alt="" class="w-5 h-5" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NoteInput',

    props: {
        modelValue: {
            type: String,
            default: ''
        },
        selectedMessage: {
            type: Object,
            default: null
        }
    },

    emits: ['update:modelValue', 'send', 'clear-selected']
}
</script>
