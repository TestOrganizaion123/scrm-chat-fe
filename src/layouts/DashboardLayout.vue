<template>
    <div class="dashboard-layout">
        <Sidebar />
        <main class="main-content">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import Sidebar from '@/layouts/Sidebar.vue'
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    height: 100vh;
    background: #f8fafc;
    overflow: hidden;
}

.main-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}
</style>
