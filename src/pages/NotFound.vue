<template>
    <div class="not-found">
        <h1>404</h1>
        <p>Trang bạn tìm kiếm không tồn tại</p>
        <router-link to="/" class="btn-home">Về trang chủ</router-link>
    </div>
</template>

<style scoped>
.not-found {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
}

h1 {
    font-size: 6rem;
    margin: 0;
    color: #667eea;
}
p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 30px;
}
.btn-home {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
}
</style>
