# SCRM Chat Frontend - Documentation

## Luồng dữ liệu & Kiến trúc (Data Flow & Architecture)

Dưới đây là mô tả chi tiết về cách dữ liệu di chuyển trong ứng dụng, từ lúc khởi tạo đến các tương tác chính.

### 1. Khởi tạo ứng dụng (Initialization)

-   **Entry Point:** `src/main.js`
    -   Khởi tạo Vue app.
    -   Cài đặt Pinia (State Management) và Vue Router.
    -   **Authentication:** Gọi API `/public/authentication` và `/scrm/public/authentication` để xác thực phiên làm việc ngay khi app load.
    -   Mount app vào `#app`.

### 2. Routing & Layout

-   **Router:** `src/router/index.js` định nghĩa các routes.
-   **Root Component:** `App.vue` chỉ chứa `<router-view />` để render component tương ứng với route hiện tại.
-   **Layout:**
    -   `DashboardLayout.vue`: Layout chính cho các trang sau khi login (có Sidebar, Header).
    -   Các trang con (`PlatformConnection`, `ChatView`...) được render bên trong `DashboardLayout`.

### 3. Luồng chi tiết các tính năng chính

#### A. Kết nối nền tảng (Platform Connection)

-   **Route:** `/platforms` (Mặc định redirect từ `/`)
-   **Component:** `src/pages/PlatformConnection.vue`
-   **Nguồn dữ liệu:**
    -   Hiện tại đang sử dụng Mock Data từ `src/data/chatMock.js` (`listSocial`).
    -   Dữ liệu được gán vào biến `platforms`.
-   **Hiển thị:**
    -   Component lặp qua danh sách `platforms` và render các `src/components/PlatformCard.vue`.
-   **Chuyển hướng:**
    -   Khi người dùng click vào một **PlatformCard**:
    -   Sự kiện `@click` kích hoạt hàm `navigateToChat`.
    -   Router push về `/chat/:id` (với `:id` là `source_id` của platform).

#### B. Chat & Hội thoại (Chat View)

-   **Route:** `/chat/:id?` (ID là optional)
-   **Component:** `src/pages/ChatView.vue`
-   **Nguồn dữ liệu:**
    -   Sử dụng Mock Data từ `src/data/chatMock.js` (`chatData`).
    -   Dữ liệu được load vào biến `conversations`.
-   **Luồng xử lý:**
    1.  **Sidebar (Danh sách hội thoại):**
        -   Hiển thị danh sách từ `conversations`.
        -   Hỗ trợ tìm kiếm (filter local).
    2.  **Chọn hội thoại:**
        -   User click vào một item trong sidebar -> kích hoạt `selectConversation`.
        -   Hàm `generateMockMessages` được gọi để tạo dữ liệu tin nhắn giả lập (dựa trên contact của hội thoại đó).
    3.  **Khung Chat chính:**
        -   Hiển thị tin nhắn từ `currentMessages`.
        -   **Avatar xử lý động:** Avatar tin nhắn đến (received) được lấy từ thông tin `sender` trong mock data, đảm bảo hiển thị đúng người gửi.
    4.  **Gửi tin nhắn:**
        -   User nhập text -> `sendMessage`.
        -   Tin nhắn mới được push vào mảng `currentMessages` (hiện tại chỉ ở local state, chưa gọi API).

#### C. Đăng nhập (Login)

-   **Route:** `/login`
-   **Component:** `src/pages/Login.vue`
-   **Luồng:**
    -   User nhập Email/Pass.
    -   Gọi API `/public/auth/login`.
    -   Nếu thành công -> Lưu token -> Redirect về `/` (tức `/platforms`).

---

### Tóm tắt luồng file quan trọng

1.  `main.js` (Khởi tạo)
2.  `router/index.js` (Điều hướng)
3.  `layouts/DashboardLayout.vue` (Khung giao diện)
4.  `pages/PlatformConnection.vue` (Danh sách kết nối)
    -   -> `components/PlatformCard.vue` (Thẻ kết nối)
5.  `pages/ChatView.vue` (Giao diện Chat)
    -   -> `data/chatMock.js` (Dữ liệu giả lập)
