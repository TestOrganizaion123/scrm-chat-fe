<template>
    <div
        class="absolute bottom-full left-1/2 mb-3 px-2 py-1 bg-[#333] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity"
        style="transform: translateX(-50%)"
    >
        {{ text }}
        <span
            class="absolute bottom-0 left-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#333]"
            style="transform: translate(-50%, 100%)"
        ></span>
    </div>
</template>

<script>
export default {
    name: 'Tooltip',

    props: {
        text: {
            type: String,
            required: true
        }
    }
}
</script>
