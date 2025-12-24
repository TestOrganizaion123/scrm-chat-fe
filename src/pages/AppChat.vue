<template>
    <div class="bg-[#e8f1fd] w-full h-full flex flex-col overflow-hidden">
        <!-- Page Header -->
        <PageHeader title="Kết nối nền tảng" @back="showChat = false" />

        <div v-if="showChat" class="flex flex-col h-full bg-[#f0f2f5] font-['Inter'] flex-1 overflow-hidden">
            <div class="w-full flex flex-1 overflow-hidden">
                <!-- Sidebar - Danh sách conversations -->
                <aside class="w-[350px] bg-white border-r border-[#e4e6eb] flex flex-col h-full">
                    <div class="flex gap-[10px] p-4 border-b border-[#e4e6eb] bg-white">
                        <div class="flex items-center gap-2">
                            <DateRange @change="handleDateRangeChange" />

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <button class="w-[42px] h-[42px] rounded-[12px] border border-[#e4e6eb] flex items-center justify-center text-[#1a1a1a] bg-white hover:bg-[#f5f5f5] cursor-pointer transition-colors">
                                        <img src="/icon/icon-filter.svg" alt="" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent class="absolute left-0 bg-white">
                                    <DropdownMenuLabel>Trạng thái hội thoại</DropdownMenuLabel>
                                    <div class="flex flex-col w-[180px] gap-[2px] border-b border-[#e4e6eb] cursor-pointer justify-center">
                                        <DropdownMenuItem class="flex items-center justify-between space-between hover:bg-[#f5f5f5] m-[1px] rounded-[10px]">
                                            <div class="font-['Inter_Tight']" @click="handleFilterEnd(true)">Tin nhắn đã kết thúc</div>
                                            <div>
                                                <img src="/icon/icon-tick.svg" alt="" v-if="this.is_end" />
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem class="flex items-center justify-between space-between hover:bg-[#f5f5f5] m-[1px] rounded-[10px]">
                                            <div class="font-['Inter_Tight']" @click="handleFilterEnd(false)">Tin nhắn chưa kết thúc</div>
                                            <div>
                                                <img src="/icon/icon-tick.svg" alt="" v-if="!this.is_end" />
                                            </div>
                                        </DropdownMenuItem>
                                    </div>
                                    <div class="flex flex-col w-[180px] gap-[2px] cursor-pointer justify-center">
                                        <DropdownMenuLabel>Trạng thái tin nhắn</DropdownMenuLabel>
                                        <DropdownMenuItem class="flex items-center justify-between space-between hover:bg-[#f5f5f5] m-[1px] rounded-[10px]">
                                            <div class="font-['Inter_Tight']" @click="handleFilterType('read')">Tin nhắn đã đọc</div>
                                            <div>
                                                <img src="/icon/icon-tick.svg" alt="" v-if="this.type_filter === 'read'" />
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem class="flex items-center justify-between space-between hover:bg-[#f5f5f5] m-[1px] rounded-[10px]">
                                            <div class="font-['Inter_Tight']" @click="handleFilterType('unread')">Tin nhắn chưa đọc</div>
                                            <div>
                                                <img src="/icon/icon-tick.svg" alt="" v-if="this.type_filter === 'unread'" />
                                            </div>
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div class="relative" ref="searchContainer">
                                <button class="w-[42px] h-[42px] rounded-[12px] border border-[#e4e6eb] flex items-center justify-center text-[#1a1a1a] bg-white hover:bg-[#f5f5f5] cursor-pointer transition-colors" @click="showSearchConversation = !showSearchConversation">
                                    <img src="/icon/icon-search.svg" alt="" />
                                </button>

                                <div v-if="showSearchConversation" class="absolute top-[50px] left-0 z-50 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-[8px] p-2 w-[250px] animate-fade-in border border-[#e4e6eb]">
                                    <div class="flex items-center gap-2 bg-white rounded-[6px] px-2 py-1.5">
                                        <img src="/icon/icon-search.svg" alt="" class="w-4 h-4 opacity-50" />
                                        <input v-model="searchConversation" type="text" placeholder="Tìm kiếm..." class="border-none outline-none text-[0.9rem] w-full placeholder-[#9ca3af]" @keyup.enter="handleSearchConversation" ref="searchInput" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-[10px]">
                            <div class="flex items-center gap-[10px]">
                                <label class="flex items-center gap-[4px] align-center">
                                    <input type="radio" v-model="filter" value="and" />
                                    <div class="text-black text-sm font-medium leading-4">And</div>
                                </label>
                                <label class="flex items-center gap-[4px] align-center">
                                    <input type="radio" v-model="filter" value="or" />
                                    <div class="text-black text-sm font-medium leading-4">Or</div>
                                </label>
                            </div>

                            <!-- Hiển thị danh sách tag trong tags -->
                            <div class="flex flex-wrap gap-1 items-center relative" @click.stop>
                                <div v-for="tag in tags.slice(0, 6)" :key="tag.id" class="w-4 h-4 rounded-[6px] cursor-pointer transition-all hover:scale-110 shadow-sm border border-transparent" :class="{ '!border-[#1a56db] ring-1 ring-[#1a56db]': selectedTags.some(t => t.id === tag.id) }" :style="{ backgroundColor: tag.color }" :title="tag.tag_name" @click="toggleTagFilter(tag)"></div>

                                <div v-if="selectedTags.length" class="w-4 h-4 rounded-[4px] bg-[#f0f2f5] flex items-center justify-center cursor-pointer hover:bg-[#e4e6eb] text-[10px] font-bold text-[#65676b]" @click="clearTagFilter">X</div>

                                <div v-if="tags.length > 6" class="relative" v-click-outside="() => (showTagDropdown = false)">
                                    <div class="w-4 h-4 rounded-[4px] bg-[#f0f2f5] flex items-center justify-center cursor-pointer hover:bg-[#e4e6eb]" @click="showTagDropdown = !showTagDropdown">
                                        <img src="/icon/icon-arrow-down.svg" class="w-2.5 h-2.5 transition-transform duration-200" :class="{ 'rotate-180': showTagDropdown }" />
                                    </div>

                                    <!-- Dropdown Menu -->
                                    <div v-if="showTagDropdown" class="absolute top-[calc(100%+4px)] left-0 bg-white border border-[#e4e6eb] rounded-[8px] shadow-lg z-50 w-[200px] max-h-[300px] overflow-y-auto p-2">
                                        <div class="flex items-center gap-2 bg-white rounded-[6px] px-2 py-1.5 border border-[#e4e6eb] mb-2">
                                            <img src="/icon/icon-search.svg" class="w-3 h-3 opacity-50" />
                                            <input v-model="searchTagQuery" type="text" placeholder="Tìm kiếm theo tên..." class="border-none outline-none text-xs w-full placeholder-[#9ca3af]" />
                                        </div>
                                        <div v-for="tag in filteredDropdownTags" :key="tag.id" class="flex items-center justify-between p-2 hover:bg-gray-50 rounded-[6px] cursor-pointer" @click="toggleTagFilter(tag)">
                                            <div class="px-2 py-1 rounded-[4px] text-xs text-white font-medium truncate max-w-[140px]" :style="{ backgroundColor: tag.color }">{{ tag.tag_name }}</div>
                                            <div class="w-4 h-4 border border-[#d1d5db] rounded-[4px] flex items-center justify-center" :class="{ 'bg-[#1a56db] border-[#1a56db]': selectedTags.some(t => t.id === tag.id) }">
                                                <svg v-if="selectedTags.some(t => t.id === tag.id)" width="10" height="10" viewBox="0 0 12 12" fill="none">
                                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div v-if="filteredDropdownTags.length === 0" class="text-center py-2 text-xs text-gray-500">Không tìm thấy thẻ</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto">
                        <div v-if="loadingConversations" class="flex items-center justify-center h-full">
                            <Loader />
                        </div>
                        <template v-else>
                            <div v-for="conv in filtered_conversations" :key="conv.id" class="flex p-3 px-4 cursor-pointer transition-colors duration-200 rounded-lg mx-2 my-1 border-b border-[#e4e6eb] hover:bg-[#f2f2f2]" :class="{ 'bg-[#e7f3ff]': current_conversation?.id === conv.id }" @click="selectConversation(conv)">
                                <div class="relative mr-3 shrink-0">
                                    <img v-if="conv.thread_avatar" :src="conv.thread_avatar" alt="" class="w-12 h-12 rounded-full object-cover" />
                                    <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold text-xl">
                                        <img v-if="conv.contacts.length" :src="conv.contacts[0]?.avatar_url" alt="" class="w-12 h-12 rounded-full object-cover" />
                                        <div v-else class="w-12 h-12 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold text-xl">{{ conv.thread_name?.charAt(0) || 'Avatar' }}</div>
                                    </div>
                                </div>

                                <div class="flex-1 min-w-0 flex flex-col justify-center">
                                    <div class="flex justify-between items-center mb-1">
                                        <div class="font-semibold text-[#050505] text-[0.95rem] whitespace-nowrap overflow-hidden text-ellipsis">{{ conv.thread_name || conv.contacts[0]?.display_name || 'Không tên' }}</div>
                                        <span class="text-xs text-[#65676b] font-medium font-['Inter_Tight'] leading-4 shrink-0">{{ formatFullTime(conv.last_message_at) }}</span>
                                    </div>
                                    <div class="flex justify-between items-center">
                                        <div class="text-[0.85rem] text-[#65676b] whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]" :class="{ 'font-semibold text-[#050505]': conv.unread_count }">
                                            {{ conv.last_message_content || 'Chưa có tin nhắn' }}
                                        </div>
                                        <span v-if="conv.unread_count" class="bg-[#e41e3f] text-white text-[0.7rem] px-1.5 py-0.5 rounded-[10px] min-w-[18px] text-center font-semibold">{{ conv.unread_count }}</span>
                                    </div>
                                    <div class="flex gap-1 mt-1 flex-wrap" v-if="conv.tags && conv.tags.length">
                                        <span v-for="tag in conv.tags.slice(0, 3)" :key="tag.id" class="text-[0.65rem] px-1.5 py-0.5 rounded text-white whitespace-nowrap" :style="{ backgroundColor: tag.color }">
                                            {{ tag.tag_name }}
                                        </span>
                                        <span v-if="conv.tags.length > 3" class="text-[0.65rem] px-1.5 py-0.5 rounded bg-[#e4e6eb] text-[#65676b] whitespace-nowrap font-medium"> +{{ conv.tags.length - 3 }} </span>
                                    </div>
                                </div>
                            </div>

                            <div v-if="filtered_conversations.length === 0" class="text-center p-5 text-[#65676b]">Không tìm thấy cuộc hội thoại</div>
                        </template>
                    </div>
                </aside>

                <!-- Main chat area -->
                <main class="flex-1 flex flex-col bg-white">
                    <template v-if="current_conversation">
                        <div class="min-h-[76px] px-5 py-3 bg-white border-b border-[#e4e6eb] flex justify-between items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10">
                            <div class="flex items-center gap-3">
                                <div class="relative">
                                    <img v-if="current_conversation.thread_avatar" :src="current_conversation.thread_avatar" alt="" class="w-10 h-10 rounded-full object-cover" />
                                    <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold text-xl">
                                        <img v-if="current_conversation.contacts[0]?.avatar_url" :src="current_conversation.contacts[0]?.avatar_url" alt="" class="w-10 h-10 rounded-full object-cover" />
                                        <div v-else class="w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white flex items-center justify-center font-bold text-xl">{{ current_conversation.contacts[0]?.display_name?.charAt(0) || 'Avatar' }}</div>
                                    </div>
                                </div>
                                <div>
                                    <div class="font-bold text-[1.05rem] text-[#050505]">{{ current_conversation.thread_name || current_conversation.contacts[0]?.display_name }}</div>
                                </div>
                            </div>
                            <!-- <button class="bg-transparent border-none cursor-pointer text-[#65676b] hover:text-[#1a1a1a]" @click="showChat = false">
                                <i class="fas fa-times text-xl"></i>
                            </button> -->
                        </div>

                        <div class="flex-1 overflow-y-auto p-5 bg-[#e2d8cf] flex flex-col" ref="messages_container" @scroll="handleScroll">
                            <div v-if="loading_messages" class="flex items-center justify-center h-full">
                                <Loader />
                            </div>
                            <template v-else>
                                <div v-if="current_messages.length" class="flex flex-col gap-2">
                                    <div v-if="is_loading_more" class="flex justify-center py-2">
                                        <LoadingButton color="#0084ff" />
                                    </div>
                                    <div class="text-center text-[0.8rem] text-[#65676b] my-4">Hôm nay</div>

                                    <!-- Sửa ở đây -->
                                    <div v-for="(msg, index) in current_messages" :key="index" class="group/msg flex items-center gap-2 max-w-[70%]" :class="{ 'self-start': !msg.is_sent, 'self-end flex-row-reverse': msg.is_sent }">
                                        <template v-if="!msg.is_sent">
                                            <div v-if="msg.from_id === current_conversation.contacts[0]?.id || current_conversation.thread_name" class="shrink-0">
                                                <img v-if="current_conversation.thread_avatar || current_conversation.contacts[0]?.avatar_url" :src="current_conversation.thread_avatar || current_conversation.contacts[0]?.avatar_url" alt="" class="w-7 h-7 rounded-full object-cover" />
                                                <span v-else class="w-7 h-7 rounded-full bg-[#ccc] flex items-center justify-center text-[0.8rem] text-white">{{ current_conversation.contacts[0]?.display_name?.charAt(0) || '?' }}</span>
                                            </div>
                                            <div class="relative flex items-center gap-2 min-w-0">
                                                <div class="py-2 px-3 rounded-r-[8px] rounded-l-[5px] break-words bg-white text-[#050505] shadow-[0_1px_2px_rgba(0,0,0,0.1)] min-w-0">
                                                    <div v-if="msg.attachments?.length && msg.attachments[0].type === 'image'">
                                                        <img :src="msg.attachments[0].href" alt="" />
                                                    </div>
                                                    <div v-else-if="msg.attachments?.length && msg.attachments[0].type === 'file'">
                                                        <a :href="msg.attachments[0].href" download class="text-[0.95rem] leading-[1.4]">{{ msg.attachments[0].href }}</a>
                                                    </div>
                                                    <div v-else-if="msg.attachments?.length && msg.attachments[0].type === 'video'">
                                                        <video :src="msg.attachments[0].href" controls class="w-full h-auto"></video>
                                                    </div>
                                                    <div v-else-if="msg.attachments?.length && msg.attachments[0].type === 'voice'">
                                                        <VoiceMessage :src="msg.attachments[0].href" />
                                                    </div>
                                                    <div class="text-[0.95rem] leading-[1.4]">{{ msg.content }}</div>
                                                </div>
                                            </div>

                                            <!-- Hover actions -->
                                            <div class="flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 duration-200 bg-[#E8EDF2] rounded-[8px] px-2 shrink-0">
                                                <div class="relative group/tooltip">
                                                    <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700" @click="replyMessage(msg)">
                                                        <img src="/icon/icon-reply.svg" alt="Reply" class="w-4 h-4 shrink-0" />
                                                    </button>
                                                    <div class="absolute bottom-full left-1/2 mb-3 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity" style="transform: translateX(-50%)">
                                                        Trả lời tin nhắn
                                                        <span class="absolute bottom-0 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#333]" style="transform: translate(-50%, 100%)"></span>
                                                    </div>
                                                </div>
                                                <div class="relative group/tooltip">
                                                    <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                                                        <img src="/icon/icon-pin.svg" alt="Pin" class="w-4 h-4 shrink-0" />
                                                    </button>
                                                    <div class="absolute bottom-full left-1/2 mb-3 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity" style="transform: translateX(-50%)">
                                                        Ghim tin nhắn
                                                        <span class="absolute bottom-0 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#333]" style="transform: translate(-50%, 100%)"></span>
                                                    </div>
                                                </div>
                                                <div class="relative group/tooltip">
                                                    <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700" @click="selectNoteMessage(msg)">
                                                        <img src="/icon/icon-note.svg" alt="Note" class="w-4 h-4 shrink-0" />
                                                    </button>
                                                    <div class="absolute bottom-full left-1/2 mb-3 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity" style="transform: translateX(-50%)">
                                                        Ghi chú
                                                        <span class="absolute bottom-0 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#333]" style="transform: translate(-50%, 100%)"></span>
                                                    </div>
                                                </div>
                                                <div class="relative group/tooltip">
                                                    <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                                                        <img src="/icon/icon-end-conversation.svg" alt="End Conversation" class="w-4 h-4 shrink-0" />
                                                    </button>
                                                    <div class="absolute bottom-full left-1/2 mb-3 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity" style="transform: translateX(-50%)">
                                                        Kết thúc cuộc hội thoại
                                                        <span class="absolute bottom-0 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#333]" style="transform: translate(-50%, 100%)"></span>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Sender info on hover -->
                                            <div class="flex flex-col gap-0.5 opacity-0 group-hover/msg:opacity-100 text-xs whitespace-nowrap shrink-0">
                                                <div class="text-[#000A2C]">{{ current_conversation.contacts[0]?.display_name || current_conversation.thread_name }}</div>
                                                <div class="text-gray-500">{{ formatFullTime(msg.created_at) }}</div>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="shrink-0">
                                                <img v-if="user_crm?.avatar_url" :src="user_crm?.avatar_url" alt="" class="w-7 h-7 rounded-full object-cover" />
                                                <span class="w-7 h-7 rounded-full bg-[#ccc] flex items-center justify-center text-[0.8rem] text-white">{{ user_crm?.name?.charAt(0) || '?' }}</span>
                                            </div>

                                            <div class="relative flex items-center gap-2 min-w-0">
                                                <!-- Hover actions (bên trái cho tin nhắn sent) -->
                                                <div class="flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-200 bg-[#E8EDF2] rounded-[8px] px-2 shrink-0">
                                                    <div class="relative group/tooltip">
                                                        <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                                                            <img src="/icon/icon-end-conversation.svg" alt="End Conversation" class="w-4 h-4 shrink-0" />
                                                        </button>
                                                        <div class="absolute bottom-full left-1/2 mb-3 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity" style="transform: translateX(-50%)">
                                                            Kết thúc cuộc hội thoại
                                                            <span class="absolute bottom-0 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#333]" style="transform: translate(-50%, 100%)"></span>
                                                        </div>
                                                    </div>
                                                    <div class="relative group/tooltip">
                                                        <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700" @click="selectNoteMessage(msg)">
                                                            <img src="/icon/icon-note.svg" alt="Note" class="w-4 h-4 shrink-0" />
                                                        </button>
                                                        <div class="absolute bottom-full left-1/2 mb-3 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity" style="transform: translateX(-50%)">
                                                            Ghi chú
                                                            <span class="absolute bottom-0 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#333]" style="transform: translate(-50%, 100%)"></span>
                                                        </div>
                                                    </div>
                                                    <div class="relative group/tooltip">
                                                        <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                                                            <img src="/icon/icon-pin.svg" alt="Pin" class="w-4 h-4 shrink-0" />
                                                        </button>
                                                        <div class="absolute bottom-full left-1/2 mb-3 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity" style="transform: translateX(-50%)">
                                                            Ghim tin nhắn
                                                            <span class="absolute bottom-0 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#333]" style="transform: translate(-50%, 100%)"></span>
                                                        </div>
                                                    </div>
                                                    <div class="relative group/tooltip">
                                                        <button class="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700" @click="replyMessage(msg)">
                                                            <img src="/icon/icon-reply.svg" alt="Reply" class="w-4 h-4 shrink-0" />
                                                        </button>
                                                        <div class="absolute bottom-full left-1/2 mb-3 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity" style="transform: translateX(-50%)">
                                                            Trả lời tin nhắn
                                                            <span class="absolute bottom-0 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#333]" style="transform: translate(-50%, 100%)"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="py-2 px-3 rounded-r-[5px] rounded-l-[8px] break-words bg-[#E2F3FF] text-black min-w-0">
                                                    <div v-if="msg.attachments?.length && msg.attachments[0].type === 'image'">
                                                        <img :src="msg.attachments[0]?.href" alt="" />
                                                    </div>
                                                    <div v-else-if="msg.attachments?.length && msg.attachments[0].type === 'file'">
                                                        <a :href="msg.attachments[0]?.href" download class="text-[0.95rem] leading-[1.4]">{{ msg.attachments[0]?.href }}</a>
                                                    </div>
                                                    <div v-else-if="msg.attachments?.length && msg.attachments[0].type === 'video'">
                                                        <video :src="msg.attachments[0]?.href" controls class="w-full h-auto"></video>
                                                    </div>
                                                    <div v-else-if="msg.attachments?.length && msg.attachments[0].type === 'voice'">
                                                        <VoiceMessage :src="msg.attachments[0].href" />
                                                    </div>
                                                    <div v-else class="text-[0.95rem] leading-[1.4]">{{ msg.content }}</div>
                                                </div>
                                            </div>

                                            <!-- Sender info on hover (bên trái cho sent) -->
                                            <div class="flex flex-col gap-0.5 opacity-0 group-hover/msg:opacity-100 text-xs whitespace-nowrap shrink-0 text-right">
                                                <div class="text-[#000A2C]">{{ user_crm?.name }}</div>
                                                <div class="text-gray-500">{{ formatFullTime(msg.created_at) }}</div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <div v-else class="text-center p-5 text-[#65676b]">Chưa có tin nhắn nào</div>
                            </template>
                        </div>

                        <div v-if="tags.length && !show_reply_message" class="px-3 py-2 bg-white border-t border-[#e4e6eb] flex gap-2 flex-wrap">
                            <div v-for="tag in tags" :key="tag.id" class="px-3 py-1 rounded-[4px] text-xs font-medium cursor-pointer hover:opacity-80 text-white min-w-fit flex items-center gap-1" :class="{ 'opacity-70 cursor-wait': processingTags.includes(tag.id) }" :style="{ backgroundColor: isTagActive(tag.id) ? tag.color : tag.color + '40' }" @click="!processingTags.includes(tag.id) && addTag(tag)">
                                <LoadingButton v-if="processingTags.includes(tag.id)" color="white" />
                                {{ tag.tag_name }}
                            </div>
                        </div>

                        <div v-if="show_reply_message && selected_reply_message" class="px-4 py-3 bg-white border-t border-[#e4e6eb] flex items-center gap-3">
                            <div class="flex-1 flex items-center border-l-[4px] border-[#1a56db] bg-[#f0f7ff] rounded-[8px] px-3 py-2">
                                <div class="flex-1 min-w-0">
                                    <div class="text-[15px] font-medium text-black">{{ selected_reply_message?.is_sent ? user_crm?.name : current_conversation?.contacts[0]?.display_name || current_conversation?.thread_name || 'Người dùng' }}</div>
                                    <div class="text-sm text-gray-600 truncate">{{ selected_reply_message?.content }}</div>
                                </div>
                                <button @click="clearReplyMessage" class="shrink-0 p-1 hover:bg-gray-200 rounded ml-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500">
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="px-4 py-3 bg-white border-t border-[#e4e6eb] flex items-center gap-3 relative">
                            <!-- Shortcut suggestions dropdown -->
                            <div v-if="show_shortcut_suggestions && filtered_shortcuts.length" ref="shortcutDropdown" class="absolute bottom-full left-0 right-0 mb-1 bg-white border border-[#e4e6eb] rounded-lg shadow-lg max-h-[280px] overflow-y-auto z-50">
                                <div class="px-3 py-2 text-[14px] text-gray-500 font-medium">Gợi ý tin nhắn nhanh ({{ filtered_shortcuts.length }})</div>
                                <div class="flex flex-col gap-2 p-2 pt-0">
                                    <div v-for="(shortcut, index) in filtered_shortcuts" :key="shortcut.id || index" :ref="'shortcutItem' + index" class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all" :class="index === selected_shortcut_index ? 'border-[#1a56db] bg-white' : 'border-[#e4e6eb] hover:border-[#c5ced8]'" @click="selectShortcut(shortcut)" @mouseenter="selected_shortcut_index = index">
                                        <div class="flex flex-col gap-1 min-w-0 flex-1">
                                            <span class="text-[#1a56db] font-medium text-sm">/{{ shortcut.shortcut }}</span>
                                            <span class="text-gray-600 text-sm truncate">{{ shortcut.content }}</span>
                                        </div>
                                        <span v-if="index === selected_shortcut_index" class="text-[#1a56db] text-sm font-medium shrink-0 ml-2">↵ Enter</span>
                                    </div>
                                </div>
                            </div>
                            <div class="w-8 h-8 rounded-full overflow-hidden shrink-0">
                                <img :src="this.avatar_platform" alt="" class="w-full h-full object-cover" />
                            </div>
                            <div class="flex-1 flex items-center justify-between">
                                <input ref="msgInput" type="text" :placeholder="`Trả lời từ ${user_crm?.name || '...'}`" v-model="message_input" @keydown="handleMessageKeydown" class="flex-1 border-none bg-transparent p-2 text-[0.95rem] outline-none text-[#65676b]" />
                                <div class="flex items-center gap-3 shrink-0">
                                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a1a1a] cursor-pointer p-1 shrink-0" @click="showVoiceRecorder = true">
                                        <img src="/icon/icon-voiced.svg" alt="" class="w-6 h-6 shrink-0" />
                                    </button>
                                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a1a1a] cursor-pointer p-1 shrink-0" @click="showFolderImage = true">
                                        <img src="/icon/icon-image.svg" alt="" class="w-6 h-6 shrink-0" />
                                    </button>
                                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a1a1a] cursor-pointer p-1 shrink-0" @click="showListTag = true">
                                        <img src="/icon/icon-tag.svg" alt="" class="w-6 h-6 shrink-0" />
                                    </button>
                                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a1a1a] cursor-pointer p-1 shrink-0" @click="showShortcut = true">
                                        <img src="/icon/icon-message.svg" alt="" class="w-6 h-6 shrink-0" />
                                    </button>
                                    <button class="border-none bg-transparent text-[#65676b] hover:text-[#1a56db] cursor-pointer p-1 shrink-0" @click="sendMessage(current_conversation)">
                                        <img src="/icon/icon-send.svg" alt="" class="w-6 h-6 shrink-0" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <div class="flex-1 flex items-center justify-center bg-[#e2d8cf]">
                            <div class="text-center text-[#65676b]">
                                <i class="fas fa-comments text-[4rem] text-[#e4e6eb] mb-4"></i>
                                <h3>Chọn một cuộc hội thoại</h3>
                                <p>Bắt đầu trò chuyện với khách hàng của bạn</p>
                            </div>
                        </div>
                    </template>
                </main>

                <div class="flex flex-col justify-between bg-white w-[340px] h-full border-l border-[#e4e6eb]">
                    <div class="min-h-[76px] px-5 py-3 bg-white border-b border-[#e4e6eb] flex justify-between items-center shrink-0">
                        <div class="text-[black] text-lg font-semibold font-['Inter_Tight'] leading-7">{{ show_message_note ? 'Ghi chú tin nhắn' : 'Kết thúc tin nhắn' }}</div>
                    </div>
                    <template v-if="show_message_note">
                        <div ref="notesPanel" class="flex-1 overflow-y-auto p-3">
                            <div class="flex flex-col justify-end min-h-full gap-[15px]">
                                <div v-for="message in messages_note" :key="message.id" class="group flex flex-col p-[10px] gap-[8px] bg-[#F4F6FA] rounded-[10px]">
                                    <div class="flex justify-between">
                                        <div class="flex gap-[15px] items-center">
                                            <div class="flex gap-[5px] items-center">
                                                <img class="w-[20px] h-[20px] rounded-full" :src="listUser.find(user => user.id === message.user_id)?.avatar" alt="" />
                                                <div class="text-[12.5px] font-medium font-['Inter_Tight'] leading-5 text-[#0069FE]">{{ listUser.find(user => user.id === message.user_id)?.full_name }}</div>
                                            </div>
                                            <div class="text-xs font-medium font-['Inter_Tight'] leading-5 text-[#7D91A6]">{{ formatFullTime(message.created_at) }}</div>
                                        </div>
                                        <div class="flex gap-[3px] cursor-pointer select-none opacity-0 group-hover:opacity-100">
                                            <img class="w-[18px] h-[18px] icon-hover-blue" src="/icon/icon-note.svg" alt="" />
                                            <img class="w-[18px] h-[18px] icon-hover-red" src="/icon/icon-trash.svg" alt="" />
                                            <img class="w-[18px] h-[18px] icon-hover-yellow" src="/icon/icon-pin.svg" alt="" />
                                        </div>
                                    </div>
                                    <div v-if="message?.content" class="bg-blue-600/10 rounded-[8px]">
                                        <div class="px-3 py-2 text-Text-Neutral-500 text-sm font-medium font-['Inter'] leading-4">{{ message.content }}</div>
                                    </div>
                                    <div>{{ message.note }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 pt-0">
                            <div class="relative flex flex-col border border-[#E8EDF2] rounded-[5px] shrink-0">
                                <!-- Selected message to note -->
                                <div v-if="selected_note_message" class="flex items-center gap-2 px-[10px] py-2">
                                    <div class="flex flex-1 bg-blue-600/10 items-center justify-between rounded-[5px] pl-[5px] py-1">
                                        <div class="text-sm text-gray-600 truncate">{{ selected_note_message.content }}</div>
                                        <button @click="clearSelectedNote" class="shrink-0 p-1 hover:bg-red-50 rounded">
                                            <img src="/icon/icon-close-red.svg" alt="Close" class="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div class="shrink-0 p-1 cursor-pointer">
                                        <img src="/icon/icon-image.svg" alt="" class="w-5 h-5" />
                                    </div>
                                </div>
                                <!-- Textarea with icon -->
                                <div class="relative">
                                    <textarea v-model="note_content" placeholder="Nhập để ghi chú ( Enter để gửi )" class="w-full h-24 p-[10px] pr-10 scrollbar-thin scrollbar-thumb-[#E8EDF2] border-none outline-none resize-none" @keydown.enter.exact.prevent="sendMessageNote"></textarea>
                                    <div v-if="!selected_note_message" class="absolute top-2 right-2 cursor-pointer">
                                        <img src="/icon/icon-image.svg" alt="" class="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="flex-1 overflow-y-auto p-3 flex flex-col gap-[10px]">
                            <div v-for="(message, index) in messages_finish" :key="message.id" class="flex flex-col gap-4 bg-slate-100 p-3 rounded-[8px]">
                                <div class="flex items-center gap-3">
                                    <div class="text-[13px] font-medium text-[#039855]">Đã kết thúc lần {{ index + 1 }}</div>
                                    <div class="flex items-center gap-1.5">
                                        <img class="w-5 h-5 rounded-full object-cover" :src="listUser.find(user => user.id === message.created_by)?.avatar" alt="" />
                                        <div class="text-[13px] font-medium text-[#0069FE]">{{ listUser.find(user => user.id === message.created_by)?.full_name }}</div>
                                    </div>
                                </div>
                                <div class="text-[13px] font-medium text-[#7D91A6] bg-blue-600/10 px-3 py-1 rounded-[8px]">{{ message?.content }}</div>
                                <div class="flex flex-col gap-3">
                                    <div class="bg-[#d1fadf] px-3 py-1 rounded-full text-sm font-medium w-fit">Bắt đầu: {{ formatFullTime(message?.start_created_at) }}</div>
                                    <div class="bg-[#d1fadf] px-3 py-1 rounded-full text-sm font-medium w-fit">Kết thúc: {{ formatFullTime(message?.end_created_at) }}</div>
                                </div>
                                <div v-for="product in message?.product" :key="product.id">
                                    <div class="bg-[#d1fadf] px-3 py-1 rounded-full text-sm font-medium w-fit">{{ product }}</div>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="flex items-start gap-[20px] h-[65px] p-[20px] border-t border-[#e4e6eb] select-none shrink-0 relative z-10 bg-white">
                        <img src="/icon/icon-note-gray.svg" class="w-[25px] h-[25px] cursor-pointer icon-hover-blue" @click="show_message_note = true" alt="" />
                        <img src="/icon/icon-note-message.svg" class="w-[25px] h-[25px] cursor-pointer icon-hover-blue" @click="show_message_note = false" alt="" />
                    </div>
                </div>
            </div>
        </div>

        <template v-else>
            <!-- Toolbar -->
            <div class="flex justify-between items-center mb-[24px] bg-white px-[24px] py-[14px] shrink-0">
                <div class="flex items-center gap-[8px] bg-white rounded-[8px] border border-[#c5ced8] px-[16px] py-[8px] w-[280px]">
                    <img src="/icon/icon-search.svg" alt="" class="w-[20px] h-[20px] object-contain" />
                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm..." @keyup.enter="handleSearch" class="border-none outline-none text-[0.9rem] w-full" />
                </div>

                <div class="flex gap-[12px] items-center justify-center">
                    <button class="w-[40px] h-[40px] rounded-[8px] border border-[#e0e0e0] bg-white cursor-pointer flex items-center justify-center text-[1.2rem] transition-all duration-200 hover:bg-[#f5f5f5]" @click="refreshData">
                        <img src="/icon/icon-refresh.svg" alt="" class="w-[20px] h-[20px] object-contain" />
                    </button>
                    <button class="h-[40px] flex items-center gap-[8px] px-[20px] py-[10px] bg-[#1a56db] text-white border-none rounded-[10px] text-[0.9rem] font-medium cursor-pointer transition-colors duration-200 hover:bg-[#1648b8]" @click="showAddModal = true">
                        <img src="/icon/icon-plus.svg" alt="" class="w-[20px] h-[20px] object-contain" />
                        <p>Thêm kết nối</p>
                    </button>
                </div>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto">
                <div v-if="loading" class="flex items-center justify-center h-full">
                    <Loader />
                </div>
                <template v-else>
                    <!-- Platform Grid -->
                    <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[20px] px-[20px] pb-[20px]" @click="closeDropdown">
                        <PlatformCard v-for="platform in platforms" :key="platform.source_id" :platform="platform" :activeDropdownId="activeDropdownId" @addUser="handleAddUser(platform)" @toggleDropdown="handleToggleDropdown" @navigateToChat="navigateToChat(platform)" @click.stop />
                    </div>

                    <!-- Empty State -->
                    <div v-if="platforms.length === 0" class="text-center py-[60px] px-[20px] text-[#888]">
                        <p>Không tìm thấy kết nối nào</p>
                    </div>
                </template>
            </div>
        </template>

        <!-- Add Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click.self="showAddModal = false">
            <div class="bg-white rounded-[16px] w-[1146px] h-[800px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                <!-- Modal Header -->
                <div class="flex justify-between items-center px-[20px] py-[16px] rounded-[10px] m-[12px]">
                    <h2 class="m-0 text-[1.1rem] font-semibold text-[#111827]">Thêm kết nối</h2>
                    <button class="bg-transparent border-none cursor-pointer text-[#9ca3af] p-[4px] flex items-center justify-center rounded-[6px] transition-all duration-200 hover:bg-[#f3f4f6] hover:text-[#374151]" @click="closeModal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="flex bg-[#e8f1fd]">
                    <!-- Sidebar - Platform List -->
                    <div class="rounded-[10px] m-[12px_0_12px_12px] w-[160px] min-h-full bg-white p-[12px] flex flex-col gap-[10px] border-r border-[#e5e7eb]">
                        <div v-for="type in connection_types" :key="type.id" class="flex items-center gap-[10px] px-[12px] py-[10px] rounded-[8px] cursor-pointer transition-all duration-200 border border-[#e5e7eb] hover:bg-white" :class="{ 'bg-white border-[#1a56db] shadow-[0_2px_8px_rgba(26,86,219,0.15)]': selected_platform?.id === type.id }" @click="selected_platform = type">
                            <img :src="type.icon" :alt="type.name" class="w-[24px] h-[24px] object-contain" />
                            <span class="text-[0.9rem] font-medium text-[#374151]">{{ type.name }}</span>
                        </div>
                    </div>

                    <!-- Content - Platform Detail -->
                    <div class="m-[12px] rounded-[10px] min-h-[690px] bg-white flex-1 p-[32px] flex items-center justify-center">
                        <div v-if="selected_platform && step === 1" class="text-center max-w-[400px]">
                            <h3 class="text-[1rem] font-medium text-[#6b7280] mb-[40px] mt-0">Thêm tài khoản {{ selected_platform.name }}</h3>

                            <!-- Connection Visual -->
                            <div class="flex items-center justify-center gap-[16px] mb-[32px]">
                                <div class="w-[56px] h-[56px] bg-gradient-to-br from-[#1a56db] to-[#3b82f6] rounded-full flex items-center justify-center text-white font-bold text-[0.7rem]">
                                    <span>S-CRM</span>
                                </div>
                                <div class="flex items-center justify-center">
                                    <img src="/icon/icon-arrow.svg" alt="" class="w-[24px] h-[24px] object-contain" />
                                </div>
                                <div class="w-[56px] h-[56px] rounded-full flex items-center justify-center" :style="{ background: selected_platform.bgColor }">
                                    <img :src="`${selected_platform.icon}`" class="w-[56px] h-[56px] rounded-full object-contain" />
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="mb-[32px]">
                                <h4 class="text-[1.1rem] font-semibold text-[#111827] mb-[8px] mt-0">Kết nối S-CRM với trang {{ selected_platform.name }}</h4>
                                <p class="text-[0.875rem] text-[#6b7280] m-0 leading-[1.5]">Kết nối các trang {{ selected_platform.name }} với S-CRM để quản lý tin nhắn với khách hàng</p>
                            </div>

                            <!-- Connect Button -->
                            <button class="inline-flex items-center justify-center gap-[10px] px-[24px] py-[12px] bg-white border border-[#e5e7eb] rounded-[8px] text-[0.9rem] font-medium text-[#374151] cursor-pointer transition-all duration-200 hover:bg-[#f9fafb] hover:border-[#d1d5db]" @click="connectPlatform('log_in')" :disabled="is_loading_login">
                                <img v-if="!is_loading_login" :src="selected_platform.icon" :alt="selected_platform.name" class="w-[20px] h-[20px] object-contain" />
                                <span v-if="is_loading_login">Đang kết nối...</span>
                                <span v-else>Kết nối lại với {{ selected_platform.name }}</span>
                            </button>
                        </div>

                        <div v-else-if="step === 2" class="w-full h-full flex flex-col">
                            <div class="flex justify-between items-center mb-[20px]">
                                <h3 class="text-[1.1rem] font-semibold text-[#111827] m-0">Thêm kết nối</h3>
                            </div>

                            <div class="flex-1 overflow-y-auto pr-[4px]">
                                <div class="grid grid-cols-3 gap-[16px]">
                                    <div v-for="page in list_page" :key="page.id" class="border rounded-[12px] p-[16px] flex items-center gap-[12px] cursor-pointer transition-all duration-200" :class="isSelected(page) ? 'border-[#1a56db] bg-[#f0f7ff]' : 'border-[#e5e7eb] bg-white hover:border-[#1a56db]'" @click="togglePageSelection(page)">
                                        <img :src="page?.picture?.data?.url || page?.avatar_url || '/default-avatar.png'" class="w-[48px] h-[48px] rounded-[8px] object-cover bg-gray-100" />

                                        <div class="flex-1 min-w-0">
                                            <div class="font-semibold text-[#111827] text-[0.95rem] truncate" :title="page.name">{{ page.name }}</div>
                                            <div class="text-[0.8rem] text-[#6b7280] truncate">ID: {{ page.id }}</div>
                                        </div>

                                        <div class="w-[20px] h-[20px] rounded-[4px] border flex items-center justify-center transition-colors" :class="isSelected(page) ? 'bg-[#1a56db] border-[#1a56db]' : 'border-[#d1d5db] bg-white'">
                                            <svg v-if="isSelected(page)" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M10 3L4.5 8.5L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-end gap-[12px] mt-[24px] pt-[20px] border-t border-[#e5e7eb]">
                                <button class="px-[20px] py-[10px] rounded-[8px] border border-[#e5e7eb] bg-white text-[#374151] font-medium hover:bg-[#f9fafb] cursor-pointer" @click="closeModal">Hủy</button>
                                <button class="px-[20px] py-[10px] rounded-[8px] bg-[#1a56db] text-white font-medium hover:bg-[#1648b8] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" :disabled="selectedPages.length === 0" @click="handleConnectPages(accessToken)">Kết nối ({{ selectedPages.length }})</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <FolderImage v-if="showFolderImage" :socialId="current_platform?.social_id" @close="showFolderImage = false" />
        <ListTag v-if="showListTag" :social_id="current_platform?.social_id" :listSocials="platforms" @close="showListTag = false" />
        <Shortcut v-if="showShortcut" :social_id="current_platform?.social_id" :listSocials="platforms" :list_shortcut="shortcuts" @close="showShortcut = false" />
        <VoiceRecorder v-if="showVoiceRecorder" :socialId="current_platform?.social_id" @close="showVoiceRecorder = false" @send="handleSendVoice" />
    </div>
</template>

<script>
import { mapState } from 'pinia'
import { useUserStore } from '@/stores/user'
import PlatformCard from '@/components/PlatformCard.vue'
import FolderImage from '@/components/FolderImage.vue'
import PageHeader from '@/components/PageHeader.vue'
import Loader from '@/components/Loader.vue'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { onClickOutside } from '@vueuse/core'
import DateRange from '@/components/DateRange.vue'
import ListTag from '@/components/ListTag.vue'
import SocketService from '@/services/service.socket'
import LoadingButton from '@/components/LoadingButton.vue'
import Shortcut from '@/components/Shortcut.vue'
import VoiceRecorder from '@/components/VoiceRecorder.vue'
import VoiceMessage from '@/components/VoiceMessage.vue'

export default {
    components: {
        PlatformCard,
        FolderImage,
        PageHeader,
        Loader,
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuTrigger,
        DropdownMenuLabel,
        DateRange,
        ListTag,
        Shortcut,
        LoadingButton,
        VoiceRecorder,
        VoiceMessage
    },
    directives: {
        'click-outside': {
            mounted(el, binding) {
                el.clickOutsideEvent = function (event) {
                    if (!(el === event.target || el.contains(event.target))) {
                        binding.value(event)
                    }
                }
                document.body.addEventListener('click', el.clickOutsideEvent)
            },
            unmounted(el) {
                document.body.removeEventListener('click', el.clickOutsideEvent)
            }
        }
    },
    data() {
        return {
            loading: false,
            loadingConversations: false,
            loading_messages: false,
            is_loading_more: false,
            next_cusor: null,
            has_next_page: false,
            processingTags: [],
            showListTag: false,
            showFolderImage: false,
            showVoiceRecorder: false,
            show_message_note: true,
            showShortcut: false,
            messages_note: [],
            messages_finish: [],
            is_end: null,
            type_filter: '',
            searchConversation: '',
            searchQuery: '',
            showAddModal: false,
            selected_platform: null,
            current_platform: null,
            platforms: [],
            list_page: [],
            tags: [],
            connection_types: [
                { id: 'facebook', name: 'Facebook', icon: '/icon/icon-facebook.svg', bgColor: '#1877f2' }
                // { id: 'zalo', name: 'Zalo', icon: '/icon/icon-zalo.svg', bgColor: '#0068ff' },
                // { id: 'whatsapp', name: 'WhatsApp', icon: '/icon/icon-whatsapp.svg', bgColor: '#25D366' }
            ],
            activeDropdownId: null,
            step: 1,
            is_loading_login: false,
            selectedPages: [],
            accessToken: null,
            showChat: false,
            draft_messages: {},
            current_conversation: null,
            current_messages: [],
            conversations: [],
            avatar_platform: '',
            filter: 'and',
            showTagFilter: false,
            selectedTags: [],
            showSearchConversation: false,
            date_message: null,
            showTagDropdown: false,
            searchTagQuery: '',
            shortcuts: [],

            // Reply message
            show_reply_message: false,
            selected_reply_message: null,
            reply_message_id: '',

            // Note state
            note_content: '',
            note_message_id: null,
            selected_note_message: null,

            // Shortcut suggestion state
            show_shortcut_suggestions: false,
            selected_shortcut_index: 0
        }
    },
    computed: {
        ...mapState(useUserStore, ['user_crm', 'listUser']),

        // Computed property để mỗi conversation có input riêng
        message_input: {
            get() {
                if (!this.current_conversation) return ''
                return this.draft_messages[this.current_conversation.id] || ''
            },
            set(value) {
                if (!this.current_conversation) return
                this.draft_messages = { ...this.draft_messages, [this.current_conversation.id]: value }

                // Handle shortcut suggestions
                if (value.startsWith('/')) {
                    this.show_shortcut_suggestions = true
                    this.selected_shortcut_index = 0
                } else {
                    this.show_shortcut_suggestions = false
                }
            }
        },

        filteredDropdownTags() {
            if (!this.searchTagQuery) return this.tags
            const query = this.searchTagQuery.toLowerCase()
            return this.tags.filter(tag => tag.tag_name.toLowerCase().includes(query))
        },

        filtered_shortcuts() {
            if (!this.message_input.startsWith('/')) return []
            const query = this.message_input.slice(1).toLowerCase()
            if (!query) return this.shortcuts
            return this.shortcuts.filter(s => s.shortcut?.toLowerCase().includes(query) || s.content?.toLowerCase().includes(query))
        },

        filtered_conversations() {
            let convs = this.conversations

            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase()
                convs = convs.filter(conv => {
                    const name = conv.thread_name || conv.contacts[0]?.display_name || ''
                    return name.toLowerCase().includes(query)
                })
            }

            // Filter by tag (Client-side fallback, though API should handle it)
            if (this.selectedTags.length) {
                convs = convs.filter(conv => {
                    if (!conv.tags) return false
                    const convTagIds = conv.tags.map(t => t.tag_id || t.id)
                    const selectedTagIds = this.selectedTags.map(t => t.id)

                    if (this.filter === 'and') {
                        // Must have ALL selected tags
                        return selectedTagIds.every(id => convTagIds.includes(id))
                    } else {
                        // Must have AT LEAST ONE selected tag
                        return selectedTagIds.some(id => convTagIds.includes(id))
                    }
                })
            }

            return convs
        }
    },
    watch: {
        showSearchConversation(val) {
            if (val) {
                this.$nextTick(() => {
                    this.$refs.searchInput?.focus()
                })
            }
        },
        showChat(val) {
            if (val) {
                this.$nextTick(() => {
                    if (this.$refs.searchContainer) {
                        this.stopClickOutside = onClickOutside(this.$refs.searchContainer, () => {
                            this.showSearchConversation = false
                        })
                    }
                })
            } else {
                if (this.stopClickOutside) this.stopClickOutside()
                this.showSearchConversation = false
            }
        },
        filter() {
            if (this.selectedTags.length) {
                this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
            }
        }
    },
    mounted() {
        this.selected_platform = this.connection_types[0]
        this.fetchListSocial()
        this.initFacebookSDK()
        this.scrollToElement() // cuộn scroll đến element

        // Connect socket
        const token = localStorage.getItem('accessToken')
        if (token) {
            SocketService.connect(token)

            SocketService.onConversationUpdated(data => {
                const { message, conversation } = data

                // 1. Update conversation list
                const index = this.conversations.findIndex(c => c.id == conversation.id)
                if (index !== -1) {
                    // Update existing conversation
                    const updated_conv = { ...this.conversations[index], ...conversation }
                    // Tạo array mới để Vue detect thay đổi
                    this.conversations = [updated_conv, ...this.conversations.slice(0, index), ...this.conversations.slice(index + 1)]
                } else {
                    // Add new conversation
                    this.conversations = [conversation, ...this.conversations]
                }

                // 2. Update current messages if viewing this conversation
                if (this.current_conversation && this.current_conversation.id == conversation.id && message) {
                    // Check if message already exists to avoid duplicates
                    const lastMsg = this.current_messages[this.current_messages.length - 1]

                    if (!lastMsg || lastMsg.message_id !== message.message_id) {
                        this.current_messages.push({
                            id: message._id,
                            message_id: message.message_id,
                            content: message.content,
                            is_sent: message.is_sent,
                            time: moment(message.created_at).format('HH:mm'),
                            from_id: message.from_id,
                            attachments: message.attachments || []
                        })
                        this.$nextTick(() => {
                            this.scrollToBottom()
                        })
                    }
                }
            })
        }
    },
    beforeUnmount() {
        if (this.stopClickOutside) this.stopClickOutside()
        SocketService.disconnect()
    },
    methods: {
        formatUserName(user_id) {
            return this.listUser.find(user => user.id === user_id)?.name
        },
        replyMessage(msg) {
            this.reply_message_id = msg.message_id
            this.selected_reply_message = msg
            this.show_reply_message = true
        },
        clearReplyMessage() {
            this.reply_message_id = ''
            this.selected_reply_message = null
            this.show_reply_message = false
        },
        selectNoteMessage(msg) {
            this.note_message_id = msg.message_id
            this.selected_note_message = msg
            this.note_content = ''
            // Scroll panel để hiển thị đầy đủ notes khi selected message xuất hiện
            this.scrollNotesPanel()
        },
        clearSelectedNote() {
            this.selected_note_message = null
            this.note_message_id = null
        },
        scrollNotesPanel() {
            this.$nextTick(() => {
                const panel = this.$refs.notesPanel
                if (panel) {
                    panel.scrollTop = panel.scrollHeight
                }
            })
        },
        async sendMessageNote() {
            if (!this.note_content.trim()) return

            try {
                const response = await api({
                    url: '/scrm/chat/message-note',
                    method: 'POST',
                    data: {
                        social_id: this.current_platform.social_id,
                        conversation_id: this.current_conversation.conversation_id,
                        message_id: this.note_message_id,
                        note: this.note_content,
                        image_url: [],
                        video_url: []
                    }
                })

                if (!response.error) {
                    this.note_content = ''
                    this.clearSelectedNote()
                    // Refresh message notes
                    this.listMessageNote(this.current_platform.social_id, this.current_conversation.conversation_id)
                }
            } catch (error) {
                console.error('Error sending message note:', error)
            }
        },
        isTagActive(tagId) {
            if (!this.current_conversation?.tags) return false
            return this.current_conversation.tags.some(t => (t.tag_id || t.id) === tagId)
        },
        scrollToElement() {
            const el = this.$refs.scrollToMe

            if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
            }
        },
        toggleTagFilter(tag) {
            const index = this.selectedTags.findIndex(t => t.id === tag.id)
            if (index !== -1) {
                this.selectedTags.splice(index, 1)
            } else {
                this.selectedTags.push(tag)
            }
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },
        clearTagFilter() {
            this.selectedTags = []
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },
        navigateToChat(platform) {
            this.showChat = true
            this.current_platform = platform
            this.avatar_platform = platform.avatar_url
            this.fetchConversations(platform.social_id)
            this.listTag(platform.social_id)
            this.listShortcut(platform.social_id)
        },

        async listMessageNote(social_id, conversationId) {
            let res = await api({
                url: '/scrm/chat/message-note',
                method: 'GET',
                params: {
                    social_id: social_id,
                    conversation_id: conversationId,
                    page: 1,
                    limit: 50
                }
            })
            if (res.success) {
                this.messages_note = res.data.reverse()
                this.scrollNotesPanel()
            } else {
                this.messages_note = []
            }
        },

        async listTag(social_id) {
            let res = await api({
                url: '/scrm/chat/tag',
                method: 'GET',
                params: {
                    social_ids: [social_id]
                }
            })
            if (res.success) {
                this.tags = res.data[0].tags || []
            } else {
                this.tags = []
            }
        },
        async listShortcut(social_id) {
            let res = await api({
                url: '/scrm/chat/shortcut',
                method: 'GET',
                params: {
                    social_ids: [social_id]
                }
            })
            if (res.success) {
                this.shortcuts = res.data
            } else {
                this.shortcuts = []
            }
        },
        async fetchListSocial(searchQuery = '') {
            this.loading = true
            try {
                let res = await api({
                    url: '/scrm/chat/list-social',
                    method: 'get',
                    params: {
                        search: searchQuery
                    }
                })
                if (res.success) {
                    this.platforms = res.list_social || res.data
                }
            } finally {
                this.loading = false
            }
        },
        refreshData() {
            this.platforms = []
            this.fetchListSocial()
        },
        handleAddUser(platform) {
            console.log('Add user to platform:', platform)
        },
        initFacebookSDK() {
            window.fbAsyncInit = function () {
                window.FB.init({
                    appId: '777689580698725',
                    cookie: true,
                    xfbml: true,
                    version: 'v17.0'
                })

                window.FB.AppEvents.logPageView()
            }

            let id = 'facebook-jssdk'
            if (document.getElementById(id)) return

            let node = document.getElementsByTagName('script')[0]
            let script = document.createElement('script')
            script.id = id
            script.src = 'https://connect.facebook.net/en_US/sdk.js'
            node.parentNode.insertBefore(script, node)
        },

        connectPlatform(type) {
            this.is_loading_login = true
            window.FB.login(
                response => {
                    if (response.authResponse && response.status === 'connected') {
                        if (type === 'log_in') {
                            this.sendAccessToken(response.authResponse.accessToken)
                        } else if (type === 'reconnect') {
                            this.is_loading_login = false
                        }
                    } else {
                        this.is_loading_login = false
                    }
                },
                {
                    config_id: '1935492203982998',
                    response_type: 'token',
                    override_default_response_type: true
                }
            )
        },
        async sendAccessToken(accessToken) {
            let res = await api({
                url: '/scrm/chat/list-page',
                method: 'GET',
                params: {
                    token: accessToken
                }
            })
            this.is_loading_login = false

            if (res.success) {
                this.list_page = res.data
                this.step = 2
                this.accessToken = accessToken
            }
        },
        handleToggleDropdown(platformId) {
            if (this.activeDropdownId === platformId) {
                this.activeDropdownId = null
            } else {
                this.activeDropdownId = platformId
            }
        },
        closeDropdown() {
            this.activeDropdownId = null
        },
        closeModal() {
            this.showAddModal = false
            this.step = 1
            this.list_page = []
            this.selectedPages = []
        },
        togglePageSelection(page) {
            const index = this.selectedPages.findIndex(p => p.id === page.id)
            if (index === -1) {
                this.selectedPages.push(page)
            } else {
                this.selectedPages.splice(index, 1)
            }
        },
        isSelected(page) {
            return this.selectedPages.some(p => p.id === page.id)
        },
        async handleConnectPages(accessToken) {
            this.is_loading_login = true

            try {
                const res = await api({
                    url: '/scrm/chat/sync-facebook',
                    method: 'POST',
                    data: {
                        pageIds: this.selectedPages.map(page => page.id),
                        token: accessToken
                    }
                })

                if (res.success) {
                    this.closeModal()
                    this.fetchListSocial()
                }
            } catch (error) {
                console.error('Lỗi kết nối trang:', error)
            } finally {
                this.is_loading_login = false
            }
        },
        handleSearch() {
            this.fetchListSocial(this.searchQuery)
        },
        handleSearchConversation() {
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },

        handleFilterEnd(val) {
            this.is_end = val
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },

        handleFilterType(val) {
            this.type_filter = val
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },

        handleDateRangeChange({ start, end }) {
            this.date_message = {
                from: start.format('YYYY-MM-DD'),
                to: end.format('YYYY-MM-DD')
            }
            this.fetchConversations(this.current_platform?.social_id, this.searchConversation)
        },

        // Chat Logic
        async fetchConversations(social_id, searchConversation = '') {
            this.loadingConversations = true
            try {
                // Join socket room for this page
                if (this.current_platform?.source_id) {
                    SocketService.joinPage(this.current_platform.source_id)
                }

                const params = {
                    social_ids: [social_id],
                    page: 1,
                    limit: 50
                }

                if (searchConversation) {
                    params.search = searchConversation
                }

                if (this.selectedTags.length) {
                    params.tag_ids = this.selectedTags.map(t => t.id)
                    params.filter_type = this.filter
                }

                let res = await api({
                    url: '/scrm/chat/conversations',
                    method: 'GET',
                    params
                })

                if (res.success) {
                    this.conversations = res.data
                }
            } finally {
                this.loadingConversations = false
            }
        },

        selectConversation(conv) {
            this.current_conversation = conv
            this.listMessage(conv)
            this.listMessageNote(conv.social_id, conv.conversation_id)
            this.clearReplyMessage()
        },

        async listMessage(conv) {
            this.loading_messages = true
            this.current_messages = []
            this.next_cusor = null
            this.has_next_page = false

            try {
                const res = await api({
                    url: '/scrm/chat/messages/' + conv.conversation_id,
                    method: 'GET',
                    params: {
                        social_id: conv.social_id,
                        limit: 50
                    }
                })
                if (res.success) {
                    this.current_messages = res.data.reverse()
                    this.messages_finish = res.message_history.reverse()
                    this.next_cusor = res.paging?.cusor
                    this.has_next_page = res.paging?.has_next_page

                    this.$nextTick(() => {
                        this.scrollToBottom()
                    })
                }
            } catch (error) {
                console.error('Lỗi lấy tin nhắn:', error)
            } finally {
                this.loading_messages = false
            }
        },

        handleScroll() {
            const container = this.$refs.messages_container
            if (container.scrollTop === 0 && this.has_next_page && !this.is_loading_more) {
                this.loadMoreMessages()
            }
        },

        async loadMoreMessages() {
            if (this.is_loading_more || !this.has_next_page) return

            this.is_loading_more = true
            const container = this.$refs.messages_container
            const old_scroll_height = container.scrollHeight
            const old_scroll_top = container.scrollTop

            try {
                const res = await api({
                    url: '/scrm/chat/messages/' + this.current_conversation.conversation_id,
                    method: 'GET',
                    params: {
                        social_id: this.current_conversation.social_id,
                        limit: 50,
                        cusor: this.next_cusor
                    }
                })

                if (res.success) {
                    const newMessages = res.data.reverse()
                    this.current_messages = [...newMessages, ...this.current_messages]

                    this.next_cusor = res.paging?.cusor
                    this.has_next_page = res.paging?.has_next_page

                    this.$nextTick(() => {
                        const new_scroll_height = container.scrollHeight
                        container.scrollTop = new_scroll_height - old_scroll_height + old_scroll_top
                    })
                }
            } catch (error) {
                console.error('Lỗi tải thêm tin nhắn:', error)
            } finally {
                this.is_loading_more = false
            }
        },

        async sendMessage(conv, attachments = []) {
            if (!this.message_input.trim() && !attachments.length) return

            const message = this.message_input.trim()

            this.message_input = ''

            this.current_messages.push({
                id: Date.now(),
                content: message,
                time: moment().format('HH:mm'),
                is_sent: true
                // attachments: attachments
            })

            this.$nextTick(() => {
                this.scrollToBottom()
            })

            let data = {
                message: message,
                social_id: conv.social_id,
                source: conv.source
                // attachments: attachments
            }

            // Nếu đang reply tin nhắn, thêm replyToMessageId
            if (this.selected_reply_message?.message_id) {
                data.replyToMessageId = this.selected_reply_message.message_id
            }

            if (conv.source === 'zalo') {
                data.is_group = conv.is_group
                data.recipientId = conv.thread_id
            }

            if (conv.source === 'facebook') {
                data.pageId = conv.source_id
                data.type = conv.type
                data.conversationId = conv.conversation_id
                data.recipientId = conv.conversation_id.split('_').pop()
            }

            try {
                const res = await api({
                    url: '/scrm/chat/send-message',
                    method: 'POST',
                    data
                })

                if (res.success) {
                    // Clear reply message sau khi gửi thành công
                    this.selected_reply_message = null
                    this.show_reply_message = false

                    // Update conversation list với tin nhắn mới
                    const conv_index = this.conversations.findIndex(c => c.id === conv.id)
                    if (conv_index !== -1) {
                        const updated_conv = {
                            ...this.conversations[conv_index],
                            last_message_content: message,
                            last_message_at: new Date().toISOString()
                        }
                        // Tạo array mới để Vue detect thay đổi
                        this.conversations = [updated_conv, ...this.conversations.slice(0, conv_index), ...this.conversations.slice(conv_index + 1)]
                        this.current_conversation = updated_conv
                    }
                }
            } catch (error) {
                console.error('Lỗi gửi tin nhắn:', error)
            }
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messages_container
                if (container) {
                    container.scrollTop = container.scrollHeight
                }
            })
        },
        formatFullTime(dateString) {
            if (!dateString) return ''
            const date = moment(dateString)
            const now = moment()

            if (date.toDate() === now.toDate()) {
                return moment(dateString).format('HH:mm:ss')
            }

            return moment(dateString).format('HH:mm DD/MM/YYYY')
        },
        async addTag(tag) {
            if (this.processingTags.includes(tag.id)) return
            this.processingTags.push(tag.id)
            try {
                let res = await api({
                    url: '/scrm/chat/conversation/tag',
                    method: 'POST',
                    data: {
                        conversation_id: this.current_conversation.id,
                        tag_id: tag.id,
                        social_id: tag.social_id
                    }
                })

                if (res.success) {
                    // Update local state without re-fetching
                    const conv_index = this.conversations.findIndex(c => c.id === this.current_conversation.id)

                    if (conv_index !== -1) {
                        const conv = this.conversations[conv_index]
                        if (!conv.tags) conv.tags = []

                        const tagIndex = conv.tags.findIndex(t => (t.tag_id || t.id) === tag.id)

                        if (tagIndex !== -1) {
                            // Tag exists, remove it (toggle off)
                            conv.tags.splice(tagIndex, 1)
                        } else {
                            // Tag doesn't exist, add it (toggle on)
                            conv.tags.push(tag)
                        }

                        // Sync current_conversation tags
                        if (this.current_conversation && this.current_conversation.id === conv.id) {
                            this.current_conversation.tags = [...conv.tags]
                        }
                    }
                }
            } catch (error) {
                console.error('Lỗi cập nhật thẻ:', error)
            } finally {
                this.processingTags = this.processingTags.filter(id => id !== tag.id)
            }
        },
        handleMessageKeydown(event) {
            // Handle shortcut suggestions navigation
            if (this.show_shortcut_suggestions && this.filtered_shortcuts.length) {
                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    this.selected_shortcut_index = (this.selected_shortcut_index + 1) % this.filtered_shortcuts.length
                    this.scrollShortcutIntoView()
                    return
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    this.selected_shortcut_index = this.selected_shortcut_index === 0 ? this.filtered_shortcuts.length - 1 : this.selected_shortcut_index - 1
                    this.scrollShortcutIntoView()
                    return
                } else if (event.key === 'Enter') {
                    event.preventDefault()
                    this.selectShortcut(this.filtered_shortcuts[this.selected_shortcut_index])
                    return
                } else if (event.key === 'Escape') {
                    event.preventDefault()
                    this.show_shortcut_suggestions = false
                    return
                }
            }

            // Handle normal message send
            if (event.key === 'Enter') {
                event.preventDefault()
                this.sendMessage(this.current_conversation)
            }
        },
        scrollShortcutIntoView() {
            this.$nextTick(() => {
                const item = this.$refs['shortcutItem' + this.selected_shortcut_index]
                if (item) {
                    const el = Array.isArray(item) ? item[0] : item
                    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
                }
            })
        },
        selectShortcut(shortcut) {
            if (!shortcut) return
            this.message_input = shortcut.content || ''
            this.show_shortcut_suggestions = false
            this.$nextTick(() => {
                this.$refs.msgInput?.focus()
            })
        },
        handleSendVoice({ file, save }) {
            // file is the response from upload API, usually contains url
            // Assuming file structure matches what's needed for attachments
            // If file is array (from upload endpoint), take first item
            const attachment = Array.isArray(file) ? file[0] : file

            // Construct attachment object
            // Adjust based on actual API response. If it returns just URL string, wrap it.
            // If it returns object with url, use it.
            const attachmentObj = {
                type: 'audio',
                href: attachment.url || attachment // Fallback if it's just a string
            }

            this.sendMessage(this.current_conversation, [attachmentObj])

            if (save) {
                // Implement save logic if needed, e.g. save to shortcuts or favorites
                console.log('Save voice note requested')
            }
        }
    }
}
</script>

<style scoped></style>
