<template>
    <div class="flex flex-col justify-between bg-white w-[340px] h-full border-l border-[#e4e6eb]">
        <!-- Header -->
        <div class="min-h-[76px] px-5 py-3 bg-white border-b border-[#e4e6eb] flex justify-between items-center shrink-0">
            <div class="text-[black] text-lg font-semibold font-['Inter_Tight'] leading-7">
                {{ showNotes ? 'Ghi chú tin nhắn' : 'Kết thúc tin nhắn' }}
            </div>
        </div>

        <!-- Notes view -->
        <template v-if="showNotes">
            <div ref="notesPanel" class="flex-1 overflow-y-auto p-3">
                <div class="flex flex-col justify-end min-h-full gap-[15px]">
                    <NoteItem
                        v-for="note in notes"
                        :key="note.id"
                        :note="note"
                        :list-user="listUser"
                    />
                </div>
            </div>

            <NoteInput
                :model-value="noteContent"
                :selected-message="selectedNoteMessage"
                @update:model-value="$emit('update:noteContent', $event)"
                @send="$emit('send-note')"
                @clear-selected="$emit('clear-selected-note')"
            />
        </template>

        <!-- Finish history view -->
        <template v-else>
            <FinishHistory
                :messages="finishMessages"
                :list-user="listUser"
            />
        </template>

        <!-- Bottom tabs -->
        <div class="flex items-start gap-[20px] h-[65px] p-[20px] border-t border-[#e4e6eb] select-none shrink-0 relative z-10 bg-white">
            <img
                src="/icon/icon-note-gray.svg"
                class="w-[25px] h-[25px] cursor-pointer icon-hover-blue"
                @click="$emit('update:showNotes', true)"
                alt=""
            />
            <img
                src="/icon/icon-note-message.svg"
                class="w-[25px] h-[25px] cursor-pointer icon-hover-blue"
                @click="$emit('update:showNotes', false)"
                alt=""
            />
        </div>
    </div>
</template>

<script>
import NoteItem from './NoteItem.vue'
import NoteInput from './NoteInput.vue'
import FinishHistory from './FinishHistory.vue'

export default {
    name: 'NotesPanel',

    components: {
        NoteItem,
        NoteInput,
        FinishHistory
    },

    props: {
        showNotes: {
            type: Boolean,
            default: true
        },
        notes: {
            type: Array,
            default: () => []
        },
        finishMessages: {
            type: Array,
            default: () => []
        },
        listUser: {
            type: Array,
            default: () => []
        },
        noteContent: {
            type: String,
            default: ''
        },
        selectedNoteMessage: {
            type: Object,
            default: null
        }
    },

    emits: [
        'update:showNotes',
        'update:noteContent',
        'send-note',
        'clear-selected-note'
    ],

    methods: {
        scrollToBottom() {
            this.$nextTick(() => {
                const panel = this.$refs.notesPanel
                if (panel) {
                    panel.scrollTop = panel.scrollHeight
                }
            })
        }
    }
}
</script>
