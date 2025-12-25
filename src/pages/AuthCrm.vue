<template>
    <div v-if="step === 'not-enter'" class="np-container flex items-center justify-center bg-gray-50 px-4">
        <div class="flex flex-col items-center gap-[12px]">
            <img src="/image/not-permission.svg" alt="" />
            <div class="self-stretch text-center justify-start text-Text-Primary-900 text-4xl font-semibold font-['Inter_Tight']">Không có quyền truy cập</div>
            <div class="self-stretch text-center justify-start text-Text-Neutral-500 text-2xl font-medium font-['Inter_Tight'] leading-8"><p class="text-[#7D91A6] p-[12px]">Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ lại với quản trị viên</p></div>
        </div>
    </div>
    <div v-else-if="step === 'create-otp'" class="np-container flex items-center justify-center bg-gray-50 px-4">
        <div class="flex flex-col items-center bg-white p-[32px] rounded-[8px] w-full max-w-[500px]">
            <div class="mb-[24px]">
                <img src="/icon/icon-verified.svg" alt="" />
            </div>
            <div class="text-center text-Text-Primary-900 text-[32px] font-semibold font-['Inter_Tight'] leading-10 mb-[8px]">Bật xác thực 2 yếu tố</div>
            <div class="text-center text-[#7D91A6] text-base font-medium font-['Inter_Tight'] leading-6 mb-[38px]">Vui lòng bật xác thực 2FA để có thể truy cập vào trang!</div>
            <div class="flex items-center justify-center font-medium font-['Inter_Tight'] leading-5 bg-[#0069FE] w-full rounded-[8px] text-white p-[14px] cursor-pointer hover:bg-blue-600 transition-colors" @click="handleCreateOtp()">Bật xác thực</div>
        </div>
    </div>
    <div v-else-if="step === 'verify-otp'" class="np-container flex items-center justify-center bg-gray-50 px-4">
        <div class="flex flex-col items-center bg-white p-[32px] rounded-[8px] w-full max-w-[500px]">
            <div class="mb-[24px]">
                <div class="bg-blue-50 rounded-full flex items-center justify-center">
                    <img src="/icon/icon-otp-verified.svg" alt="" />
                </div>
            </div>
            <div class="text-center text-Text-Primary-900 text-[32px] font-semibold font-['Inter_Tight'] leading-10 mb-[8px]">Nhập mã xác minh OTP</div>
            <div class="text-center text-[#7D91A6] text-base font-medium font-['Inter_Tight'] leading-6 mb-[32px]">Vui lòng nhập mã OTP hiển thị trên thiết bị của bạn</div>

            <div class="flex gap-[12px] mb-[38px]">
                <input v-for="(val, index) in otpValues" :key="index" :ref="el => setOtpInput(el, index)" v-model="otpValues[index]" type="text" class="otp-input w-[48px] h-[48px] rounded-[8px] text-center text-xl font-semibold text-Text-Primary-900" maxlength="1" @input="handleOtpInput(index, $event)" @keydown.delete="handleOtpDelete(index, $event)" @paste="handleOtpPaste" />
            </div>
            <div class="flex items-center justify-center font-medium font-['Inter_Tight'] leading-5 bg-[#0069FE] w-full rounded-[8px] text-white p-[14px] cursor-pointer hover:bg-blue-600 transition-colors" @click="submitOtp()">Xác nhận mã OTP</div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { verifyOTP, useUserStore } from '../stores/user'

// OTP Logic
const verifyOTPStore = verifyOTP()

// User Logic
const userStore = useUserStore()

const step = ref(null)
const form = ref({
    email: '',
    password: ''
})
const errors = ref({})
const loading = ref(false)
const errorMessage = ref('')

// Use watch to reactively update step when data is available
watch(
    () => [verifyOTPStore.otp, userStore.user],
    ([newOtp, newUser]) => {
        console.log('Data updated:', { newOtp, newUser })

        if (!newOtp || !newUser) return

        const userRole = newUser.user?.role

        if (newOtp.subcode === 'authorization-failure' || userRole === 'user') {
            step.value = 'not-enter'
            return
        }

        // 2. Check SCRM auth status
        if (!newOtp.isLogin) {
            const scrmUser = newOtp.user || {}

            if (!scrmUser.is_can_access_site) {
                step.value = 'not-enter'
            } else if (scrmUser.is_two_factor_enabled) {
                step.value = 'verify-otp'
            } else {
                step.value = 'create-otp'
            }
        }

        if (newOtp.isLogin) {
            window.location.href = '/app/chat'
        }
    },
    { immediate: true }
)

const otpValues = ref(['', '', '', '', '', ''])
const otpInputs = ref([])

const setOtpInput = (el, index) => {
    if (el) {
        otpInputs.value[index] = el
    }
}

const submitOtp = async () => {
    const otpCode = otpValues.value.join('')
    if (otpCode.length !== 6) return

    let res = await api({
        url: '/scrm/public/verify-otp',
        method: 'POST',
        data: {
            otp: otpCode
        }
    })

    if (res.success) {
        if (res.access_token) {
            localStorage.setItem('accessToken', res.access_token)
        }
        window.location.reload()
    } else {
        consosle.log(res.message || 'Xác thực thất bại')
    }
}

const handleOtpInput = async (index, event) => {
    const value = event.target.value

    // Ensure only numbers
    if (!/^\d*$/.test(value)) {
        otpValues.value[index] = ''
        return
    }

    otpValues.value[index] = value.slice(-1) // Keep only the last character entered

    if (value && index < 5) {
        nextTick(() => {
            otpInputs.value[index + 1]?.focus()
        })
    }

    // Check if OTP is complete
    if (otpValues.value.join('').length === 6) {
        await submitOtp()
    }
}

const handleOtpDelete = (index, event) => {
    if (!otpValues.value[index] && index > 0) {
        otpValues.value[index - 1] = ''
        nextTick(() => {
            otpInputs.value[index - 1]?.focus()
        })
    }
}

const handleOtpPaste = event => {
    event.preventDefault()
    const pastedData = event.clipboardData.getData('text').slice(0, 6).split('')
    pastedData.forEach((char, index) => {
        if (index < 6 && /^\d$/.test(char)) {
            otpValues.value[index] = char
        }
    })
    // Focus the last filled input or the first empty one
    const nextEmptyIndex = otpValues.value.findIndex(val => !val)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    nextTick(() => {
        otpInputs.value[focusIndex]?.focus()
    })

    // Check if OTP is complete after paste
    if (otpValues.value.join('').length === 6) {
        submitOtp()
    }
}

const handleCreateOtp = () => {
    window.location.href = 'https://dashboard.smit.team/account'
}

const handleLogin = () => {
    loading.value = true
    errorMessage.value = ''

    // Validate form
    errors.value = {}
    if (!form.value.email) errors.value.email = 'Email is required'
    if (!form.value.password) errors.value.password = 'Password is required'

    if (Object.keys(errors.value).length > 0) {
        loading.value = false
        return
    }

    // Simulate login
    setTimeout(() => {
        loading.value = false
        // Here you would typically make an API call to authenticate the user
    }, 2000)
}

const loginWithGoogle = () => {
    // Implement Google login logic here
}

const loginWithFacebook = () => {
    // Implement Facebook login logic here
}
</script>

<style scoped>
.np-container {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background: #e8f1fd;
}

/* Override global input border reset for OTP inputs */
.otp-input {
    border: 1px solid #d0d5dd !important;
}

.otp-input:focus {
    border: 1px solid #0069fe !important;
    outline: none !important;
}
</style>
