<template>
    <Button :disabled="disabled || loading" :class="[variant, 'btn']" :style="{ width: width, height: height }">
        <template v-if="!loading">
            <slot />
        </template>
        <template v-else>
            <LoadingButton :color="variant === 'primary' ? 'white' : 'black'" v-if="loading" />
        </template>
    </Button>
</template>

<script lang="ts" setup>
import { Button } from '../components/ui/button'
import LoadingButton from './LoadingButton.vue'

interface Props {
    variant?: 'outline' | 'default' | 'ghost' | 'link' | 'destructive' | 'secondary' | 'primary' | 'red'
    disabled?: boolean
    loading?: boolean
    width?: string
    height?: string
    color?: string
    // size: "sm" | "md" | "lg"
    // content: string
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'default',
    disabled: false,
    loading: false,
    width: 'auto',
    height: '40px',
    color: 'black'
})
const variant = props.variant
// const size = props.size
// const content = props.content
</script>

<style lang="scss" scoped>
.btn {
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
}
.primary {
    background-color: #0069fe;
    color: #fff;
    &:not(:disabled):hover {
        background-color: #0051da;
    }
    &:disabled {
        background: #3f96fe;
    }
}
// .red {
//     background-color: #f04438;
//     color: #fff;
//     &:not(:disabled):hover {
//         background-color: #d92d20;
//     }
// }

.default {
    background-color: #fff;
    color: #000a2c;
    border: 1px solid #c5ced8;
    box-shadow: 0px 1px 2px 0px rgba(10, 13, 18, 0.05);
    &:not(:disabled):hover {
        background: #e8edf2;
    }
    &:disabled {
        background: #c5ced8;
    }
}

button:disabled {
    cursor: not-allowed !important;
    pointer-events: unset !important;
}

.destructive {
    background-color: #f04438;
    color: #fff;
    &:not(:disabled):hover {
        background-color: #d92d20;
    }
}
.outline {
    // background-color: #fff;

    color: #000;
    // border: 1px solid #c5ced8;
    &:not(:disabled):hover {
        background: #e8edf2;
    }
}
</style>
