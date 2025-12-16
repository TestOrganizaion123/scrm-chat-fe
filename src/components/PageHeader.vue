<template>
    <div class="bg-[url('/background/header.svg')] h-[80px] bg-cover bg-no-repeat flex items-center">
        <img src="/icon/icon-arrow-left.svg" alt="" class="w-[24px] h-[24px] ml-[10px] cursor-pointer" @click="$emit('back')" />
        <h1 class="text-[1.5rem] font-semibold text-[#1a1a2e] m-0 p-[10px]">{{ title }}</h1>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true
    }
})
</script>
