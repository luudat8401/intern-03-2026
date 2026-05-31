# 📋 Rental Management System — Tài liệu mô tả dự án

## 1. Tổng quan dự án

**Rental Management System** là một hệ thống quản lý phòng trọ trực tuyến, cho phép **Chủ trọ (Master)** đăng phòng cho thuê, **Người thuê (User/Tenant)** tìm kiếm và đặt phòng, và **Quản trị viên (Admin)** giám sát toàn bộ hoạt động trên nền tảng.

### Mục tiêu

- Số hóa quy trình quản lý phòng trọ từ đăng tin → tìm phòng → ký hợp đồng → quản lý thuê.
- Cung cấp giao diện trực quan cho từng vai trò (Admin, Master, Tenant).
- Đảm bảo bảo mật dữ liệu thông qua cơ chế phân quyền (RBAC) và xác thực JWT.

---

## 2. Công nghệ sử dụng

### 2.1. Backend

| Công nghệ      | Phiên bản | Mô tả                                    |
| --------------- | --------- | ----------------------------------------- |
| **Node.js**     | 18+       | Runtime JavaScript phía server            |
| **Express.js**  | 4.x       | Web framework xử lý HTTP request/response |
| **TypeORM**     | 0.3.x     | ORM kết nối và thao tác database          |
| **PostgreSQL**  | 15+       | Hệ quản trị cơ sở dữ liệu quan hệ       |
| **JWT**         | —         | Xác thực người dùng bằng JSON Web Token   |
| **bcrypt**      | —         | Mã hóa mật khẩu một chiều                |
| **Yup**         | —         | Validate dữ liệu đầu vào (DTO layer)     |
| **Cloudinary**  | —         | Lưu trữ ảnh trên cloud (thumbnail phòng)  |
| **cookie-parser** | —       | Đọc/ghi cookie cho xác thực               |

### 2.2. Frontend

| Công nghệ           | Phiên bản | Mô tả                                   |
| -------------------- | --------- | ---------------------------------------- |
| **React.js**         | 18+       | Thư viện xây dựng giao diện người dùng   |
| **React Router v6**  | 6.x       | Điều hướng SPA (Single Page Application) |
| **Tailwind CSS**     | 3.x       | Framework CSS tiện ích (utility-first)    |
| **Material UI Icons**| 5.x       | Bộ icon chuyên nghiệp của Google         |
| **Axios**            | —         | HTTP client gọi API từ Frontend          |
| **React Hot Toast**  | —         | Thông báo trạng thái (toast notification)|
| **Vite**             | —         | Build tool và dev server siêu nhanh      |

---

## 3. Kiến trúc hệ thống

### 3.1. Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│  ┌───────────┐  ┌───────────┐  ┌──────────────────┐     │
│  │   Admin   │  │  Master   │  │   Tenant (User)  │     │
│  │  Layout   │  │  Layout   │  │     Layout       │     │
│  └─────┬─────┘  └─────┬─────┘  └────────┬─────────┘     │
│        │              │                  │              │
│        └──────────────┼──────────────────┘              │
│                       │                                 │
│              ┌────────▼────────┐                        │
│              │   Axios Client  │                        │
│              │ (withCredentials│                        │
│              │   + cookies)    │                        │
│              └────────┬────────┘                        │
└───────────────────────┼─────────────────────────────────┘
                        │ HTTP (localhost:5173 → 3000)
┌───────────────────────┼─────────────────────────────────┐
│                  BACKEND (Express)                      │
│              ┌────────▼────────┐                        │
│              │     app.js      │ (CORS, JSON, Cookie)   │
│              └────────┬────────┘                        │
│                       │                                 │
│    ┌──────────────────┼──────────────────┐              │
│    │            Routes Layer             │              │
│    │  /api/auth  /api/rooms  /api/users  │              │
│    │  /api/masters  /api/contracts       │              │
│    └──────────────────┬──────────────────┘              │
│                       │                                 │
│    ┌──────────────────▼──────────────────┐              │
│    │         Middleware Layer             │             │
│    │  verifyToken │ checkRole │ validate │              │
│    └──────────────────┬──────────────────┘              │
│                       │                                 │
│    ┌──────────────────▼──────────────────┐              │
│    │        Controller Layer             │              │
│    │  Nhận request → gọi Service → trả   │              │
│    │  response                           │              │
│    └──────────────────┬──────────────────┘              │
│                       │                                 │
│    ┌──────────────────▼──────────────────┐              │
│    │         Service Layer               │              │
│    │  Business logic chính (CRUD, phân   │              │
│    │  trang, thống kê, xóa mềm...)      │               │
│    └──────────────────┬──────────────────┘              │
│                       │                                 │
│    ┌──────────────────▼──────────────────┐              │
│    │         Model Layer (TypeORM)       │              │
│    │  Account │ User │ Master │ Room │   │              │
│    │  Contract                           │              │
│    └──────────────────┬──────────────────┘              │
└───────────────────────┼─────────────────────────────────┘
                        │
                ┌───────▼───────┐
                │  PostgreSQL   │
                │   Database    │
                └───────────────┘
```

### 3.2. Cấu trúc thư mục

```
rental-managerment/
├── backend/
│   └── src/
│       ├── config/
│       │   ├── db.js                # Cấu hình TypeORM + PostgreSQL
│       │   └── cloudinary.js        # Cấu hình upload ảnh Cloudinary
│       ├── controllers/             # Nhận request, gọi service, trả response
│       │   ├── auth.controller.js
│       │   ├── room.controller.js
│       │   ├── user.controller.js
│       │   ├── master.controller.js
│       │   └── contract.controller.js
│       ├── dtos/                    # Validate & transform dữ liệu đầu vào
│       │   ├── auth.dto.js
│       │   ├── room.dto.js
│       │   ├── user.dto.js
│       │   ├── master.dto.js
│       │   └── import-room.dto.js   # DTO cho chức năng Import Excel
│       ├── middleware/
│       │   ├── auth.middleware.js    # verifyToken, checkRole
│       │   └── validation.middleware.js  # Middleware validate qua DTO
│       ├── migrations/              # Database migration scripts
│       ├── models/                  # TypeORM Entity definitions
│       │   ├── Account.js
│       │   ├── User.js
│       │   ├── Master.js
│       │   ├── Room.js
│       │   └── Contract.js
│       ├── routes/                  # Đăng ký endpoint API
│       │   ├── auth.routes.js
│       │   ├── room.routes.js
│       │   ├── user.routes.js
│       │   ├── master.routes.js
│       │   └── contract.routes.js
│       ├── seeders/                 # Dữ liệu mẫu
│       ├── services/                # Business logic chính
│       │   ├── auth.service.js
│       │   ├── room.service.js
│       │   ├── user.service.js
│       │   ├── master.service.js
│       │   ├── contract.service.js
│       │   ├── room-export.service.js  # Service xuất file Excel
│       │   └── room-import/            # Module Import Excel phức hợp
│       │       ├── index.js            # Entry point
│       │       ├── storage.js          # Xử lý Database & Transaction
│       │       └── validator.js        # Xử lý logic kiểm tra đa tầng
│       ├── app.js                   # Express app setup
│       └── server.js                # Khởi chạy server (port 3000)
│
└── frontend/
    └── my-react-app/
        └── src/
            ├── api/                 # Axios HTTP client & API functions
            │   ├── axiosClient.js   # Base Axios config (baseURL, cookies)
            │   ├── room.api.js
            │   ├── contract.api.js
            │   └── ...
            ├── components/
            │   ├── Common/          # Component dùng chung (DeleteConfirmModal)
            │   ├── Guards/          # Route protection (ProtectedRoute, RoleDirector)
            │   ├── Layouts/         # Layout cho từng role (AdminLayout, MasterLayout, UserLayout)
            │   └── Navigation/      # Sidebar, Header
            ├── context/
            │   └── AuthContext.jsx   # Global auth state (React Context)
            ├── hooks/
            │   └── useMasterRooms.js # Custom hook cho Master quản lý phòng
            ├── pages/
            │   ├── Admin/           # Trang quản trị viên
            │   │   ├── Dashboard/
            │   │   ├── Rooms/
            │   │   ├── Users/
            │   │   ├── Masters/
            │   │   └── Contracts/
            │   ├── Master/          # Trang chủ trọ
            │   │   ├── MasterDashboard/
            │   │   ├── MasterRooms/
            │   │   ├── MasterProfile/
            │   │   └── RoomForm/
            │   ├── Tenant/          # Trang người thuê
            │   │   ├── TenantDashboard/
            │   │   ├── TenantRooms/
            │   │   ├── TenantInfo/
            │   │   └── RoomDetail/
            │   ├── Common/          # Trang dùng chung giữa các role
            │   │   └── Contracts/   # Quản lý hợp đồng (Master + User)
            │   └── Auth/            # Trang đăng nhập/đăng ký
            │       ├── Login.jsx
            │       └── Register.jsx
            ├── schemas/             # Yup validation schemas (frontend)
            ├── service/             # Auth service (frontend)
            ├── styles/              # CSS files
            ├── App.jsx              # Root component + Router config
            └── main.jsx             # Entry point
```

---

## 4. Cơ sở dữ liệu (Database Schema)

### 4.1. Sơ đồ quan hệ (ERD)

```mermaid
erDiagram
    ACCOUNTS ||--o| USERS : "1:1 (user_id)"
    ACCOUNTS ||--o| MASTERS : "1:1 (master_id)"
    MASTERS ||--o{ ROOMS : "1:N (master_id)"
    ROOMS ||--o{ USERS : "1:N (room_id)"
    ROOMS ||--o{ CONTRACTS : "1:N (room_id)"
    USERS ||--o{ CONTRACTS : "1:N (user_id)"
    MASTERS ||--o{ CONTRACTS : "1:N (master_id)"

    ACCOUNTS {
        int id PK
        varchar username UK
        varchar password
        varchar google_id UK
        varchar email
        varchar avatar
        varchar role "admin | master | user"
        varchar status "active"
        int user_id FK
        int master_id FK
        timestamp created_at
        timestamp updated_at
    }

    USERS {
        int id PK
        varchar name
        varchar phone
        boolean is_representative
        smallint status "0: active, 1: inactive"
        int room_id FK
        varchar email
        varchar address
        varchar avatar
        timestamp created_at
        timestamp updated_at
    }

    MASTERS {
        int id PK
        varchar name
        varchar phone UK
        varchar email UK
        varchar address
        varchar bankName
        varchar bankAccountNumber
        varchar bankAccountHolder
        varchar bankBranch
        varchar avatar
        timestamp created_at
        timestamp updated_at
    }

    ROOMS {
        int id PK
        varchar room_number UK
        float price
        smallint status "0-4"
        smallint capacity
        smallint current_tenants
        varchar thumbnail
        varchar city
        varchar district
        varchar ward
        varchar location
        varchar title
        varchar area
        boolean is_trending
        jsonb amenities
        text description
        int master_id FK
        timestamp created_at
        timestamp updated_at
    }

    CONTRACTS {
        int id PK
        float price
        timestamp start_date
        timestamp end_date
        smallint status "0-4"
        float deposit
        int user_id FK
        int room_id FK
        int master_id FK
        timestamp created_at
        timestamp updated_at
    }
```

### 4.2. Quy ước trạng thái (Status Codes)

#### Trạng thái Phòng (`rooms.status`)

| Mã | Tên          | Mô tả                                         |
| -- | ------------ | ---------------------------------------------- |
| 0  | Trống        | Phòng chưa có người thuê, sẵn sàng cho thuê   |
| 1  | Đã thuê      | Phòng đang có hợp đồng hiệu lực               |
| 2  | Đang xử lý   | Phòng có yêu cầu thuê đang chờ Master duyệt   |
| 3  | Bảo trì      | Phòng đang sửa chữa/bảo trì, tạm ngưng thuê  |
| 4  | Đã xóa       | Phòng đã bị xóa mềm (Soft Delete), ẩn khỏi User/Master |

#### Trạng thái Hợp đồng (`contracts.status`)

| Mã | Tên            | Mô tả                                          |
| -- | -------------- | ----------------------------------------------- |
| 0  | Đang chờ duyệt | User gửi yêu cầu thuê, chờ Master phê duyệt   |
| 1  | Đang hiệu lực  | Master đã duyệt, hợp đồng có giá trị pháp lý  |
| 2  | Đã từ chối     | Master từ chối yêu cầu thuê của User           |
| 3  | Đã hủy         | Hợp đồng bị hủy bỏ (Soft Delete)               |
| 4  | Đã kết thúc    | Hợp đồng hết hạn theo thời gian                |

---

## 5. Hệ thống xác thực & phân quyền (Auth & RBAC)

### 5.1. Luồng xác thực (Authentication Flow)

```
┌──────────┐     POST /api/auth/login      ┌──────────┐
│  Client  │  ─────────────────────────▶   │  Server  │
│ (Browser)│                               │(Express) │
│          │  ◀─────────────────────────   │          │
│          │  Set-Cookie: token (HttpOnly)  │          │
│          │  Set-Cookie: ui_state (Base64) │          │
└──────────┘                               └──────────┘

Lần request tiếp theo:
┌──────────┐   GET /api/rooms (auto-send   ┌──────────┐
│  Client  │   cookies via withCredentials) │  Server  │
│          │  ─────────────────────────▶   │          │
│          │                               │ verifyToken│
│          │                               │ checkRole │
│          │  ◀─────────────────────────   │          │
│          │        JSON Response           │          │
└──────────┘                               └──────────┘
```

**Chi tiết:**

1. **Đăng nhập**: User gửi `username/password` lên `POST /api/auth/login`.
2. **Server xác minh**: So sánh mật khẩu với bcrypt, nếu đúng tạo JWT Token.
3. **Gửi 2 Cookie về Client:**
   - `token` (HttpOnly): Chứa JWT, chỉ server đọc được → bảo mật cao.
   - `ui_state` (Base64): Chứa thông tin người dùng cơ bản (role, profileId, name...) → Frontend đọc để render giao diện.
4. **Các request tiếp theo**: Axios tự động gửi cookie kèm theo nhờ `withCredentials: true`.
5. **Middleware kiểm tra**: `verifyToken` giải mã JWT, `checkRole` kiểm tra quyền truy cập.

### 5.2. Phân quyền theo vai trò (RBAC)

| Chức năng               | Admin | Master | User |
| ------------------------ | :---: | :----: | :--: |
| Xem Dashboard thống kê   |  ✅   |   ✅   |  ✅  |
| Quản lý tất cả phòng     |  ✅   |   ❌   |  ❌  |
| Quản lý phòng của mình   |  ❌   |   ✅   |  ❌  |
| Tìm kiếm & đặt phòng    |  ❌   |   ❌   |  ✅  |
| Duyệt/từ chối hợp đồng  |  ❌   |   ✅   |  ❌  |
| Hủy yêu cầu thuê        |  ❌   |   ❌   |  ✅  |
| Xem tất cả hợp đồng     |  ✅   |   ❌   |  ❌  |
| Quản lý người dùng       |  ✅   |   ❌   |  ❌  |
| Quản lý chủ trọ          |  ✅   |   ❌   |  ❌  |
| Xem phòng đã xóa mềm    |  ✅   |   ❌   |  ❌  |
| Đăng nhập Google OAuth   |  ❌   |   ❌   |  ✅  |

---

## 6. API Endpoints

### 6.1. Authentication (`/api/auth`)

| Method | Endpoint            | Middleware       | Mô tả                  |
| ------ | ------------------- | ---------------- | ----------------------- |
| POST   | `/register`         | validate(DTO)    | Đăng ký tài khoản mới  |
| POST   | `/login`            | validate(DTO)    | Đăng nhập (username/pw)|
| POST   | `/google`           | validate(DTO)    | Đăng nhập bằng Google  |
| POST   | `/change-password`  | verifyToken, validate | Đổi mật khẩu       |
| POST   | `/logout`           | —                | Đăng xuất (xóa cookie) |

### 6.2. Rooms (`/api/rooms`)

| Method | Endpoint              | Middleware                    | Mô tả                                |
| ------ | --------------------- | ----------------------------- | ------------------------------------- |
| GET    | `/`                   | —                             | Lấy danh sách phòng (Public, ẩn status 4) |
| GET    | `/admin/all`          | verifyToken, checkRole(admin) | Lấy tất cả phòng cho Admin (bao gồm đã xóa) |
| GET    | `/master/:masterId`   | verifyToken, checkRole(master/admin) | Lấy phòng theo chủ trọ        |
| GET    | `/trending`           | —                             | Lấy phòng trending              |
| GET    | `/random`             | —                             | Lấy phòng ngẫu nhiên (gợi ý)   |
| GET    | `/:id`                | —                             | Lấy chi tiết 1 phòng           |
| POST   | `/`                   | verifyToken, checkRole(master), upload | Tạo phòng mới            |
| PUT    | `/:id`                | verifyToken, checkRole(master/admin), upload | Cập nhật phòng       |
| DELETE | `/:id`                | verifyToken, checkRole(master/admin) | Xóa mềm phòng (status → 4) |

> **⚠️ Lưu ý quan trọng:** Thứ tự khai báo Route trong Express rất quan trọng. Các route cố định (`/admin/all`, `/master/:id`, `/trending`, `/random`) phải đặt **TRƯỚC** route tham số động (`/:id`), nếu không `/:id` sẽ "nuốt" các route bên dưới (ví dụ: coi chữ "admin" là một id).

### 6.3. Users (`/api/users`)

| Method | Endpoint | Middleware                      | Mô tả                 |
| ------ | -------- | ------------------------------- | ---------------------- |
| POST   | `/`      | —                               | Tạo user mới           |
| GET    | `/`      | verifyToken, checkRole(admin)   | Lấy danh sách users    |
| GET    | `/:id`   | verifyToken                     | Lấy chi tiết 1 user    |
| PUT    | `/:id`   | verifyToken, upload, validate   | Cập nhật thông tin user |
| DELETE | `/:id`   | verifyToken, checkRole(admin)   | Xóa user               |

### 6.4. Masters (`/api/masters`)

| Method | Endpoint       | Middleware                           | Mô tả                       |
| ------ | -------------- | ------------------------------------ | ---------------------------- |
| POST   | `/`            | verifyToken, checkRole(master)       | Tạo hồ sơ chủ trọ           |
| POST   | `/get`         | verifyToken, checkRole(master)       | Lấy thông tin bằng body      |
| GET    | `/`            | verifyToken, checkRole(admin)        | Lấy danh sách chủ trọ        |
| GET    | `/:id`         | verifyToken, checkRole(master/admin) | Lấy chi tiết 1 chủ trọ       |
| GET    | `/:id/stats`   | verifyToken, checkRole(master/admin) | Lấy thống kê dashboard       |
| PUT    | `/:id`         | verifyToken, checkRole(master/admin), upload | Cập nhật hồ sơ       |
| DELETE | `/:id`         | verifyToken, checkRole(master/admin) | Xóa chủ trọ                  |

### 6.5. Contracts (`/api/contracts`)

| Method | Endpoint | Middleware                            | Mô tả                        |
| ------ | -------- | ------------------------------------- | ----------------------------- |
| GET    | `/`      | verifyToken                           | Lấy danh sách hợp đồng (theo role) |
| POST   | `/`      | verifyToken, checkRole(user)          | Tạo yêu cầu thuê phòng       |
| PUT    | `/:id`   | verifyToken                           | Cập nhật trạng thái hợp đồng  |
| DELETE | `/:id`   | verifyToken, checkRole(master/user/admin) | Hủy hợp đồng (Soft Delete → status 3) |

---

## 7. Cơ chế Xóa mềm (Soft Delete)

Hệ thống áp dụng cơ chế **Xóa mềm** cho cả Phòng và Hợp đồng để bảo toàn dữ liệu lịch sử.

### 7.1. Xóa mềm Phòng

Khi Admin hoặc Master nhấn "Xóa" một phòng:
- **Không xóa** bản ghi khỏi Database.
- Cập nhật `rooms.status = 4` (Đã xóa).
- **Phòng bị ẩn** khỏi:
  - Trang tìm kiếm của Người thuê (API Public luôn lọc `status != 4`).
  - Trang quản lý của Master (API Master luôn lọc `status != 4`).
- **Phòng vẫn hiện** trên trang Admin (qua API đặc quyền `/rooms/admin/all`).

### 7.2. Xóa mềm Hợp đồng

Khi thực hiện "Xóa" hợp đồng:
- Cập nhật `contracts.status = 3` (Đã hủy).
- Nếu hợp đồng đang **Hiệu lực (1)** hoặc **Chờ duyệt (0)**:
  - Tự động chuyển phòng liên quan về trạng thái **Trống (0)**.
  - Tự động giải phóng người thuê (set `users.room_id = null`).

### 7.3. Bảo mật API — Tách biệt quyền truy cập

Để ngăn chặn User sử dụng công cụ như Postman để xem dữ liệu đã xóa:

| API                   | Ai được gọi | Hành vi                                    |
| --------------------- | ----------- | ------------------------------------------ |
| `GET /api/rooms`      | Tất cả      | Luôn ẩn phòng `status = 4` (ép cứng trong code) |
| `GET /api/rooms/admin/all` | Chỉ Admin | Hiện tất cả, bao gồm phòng đã xóa        |

> **Nguyên tắc bảo mật**: Không dựa vào tham số query từ Client để quyết định quyền truy cập. Thay vào đó, tạo API riêng biệt với middleware `checkRole(["admin"])` để đảm bảo chỉ có Admin thực sự mới truy cập được.

---

## 8. Luồng nghiệp vụ chính

### 8.1. Luồng thuê phòng (Rental Flow)

```
Người thuê (User)                    Chủ trọ (Master)
      │                                     │
      │  1. Tìm phòng trống (status=0)      │
      │  2. Nhấn "Thuê phòng"               │
      │  ──── POST /contracts ─────────▶    │
      │        (status=0: Chờ duyệt)        │
      │        (room.status → 2: Đang xử lý)│
      │                                     │
      │                          3. Xem yêu cầu thuê
      │                          4a. Nhấn "Duyệt"
      │  ◀──── PUT /contracts/:id ─────    │
      │        (status=1: Hiệu lực)         │
      │        (room.status → 1: Đã thuê)   │
      │        (user.room_id → room.id)      │
      │                                     │
      │                  HOẶC               │
      │                                     │
      │                          4b. Nhấn "Từ chối"
      │  ◀──── PUT /contracts/:id ─────    │
      │        (status=2: Từ chối)           │
      │        (room.status → 0: Trống)      │
      └─────────────────────────────────────┘
```

### 8.2. Luồng hủy hợp đồng

```
Admin/Master/User
      │
      │  Nhấn "Xóa/Hủy" hợp đồng
      │  ──── DELETE /contracts/:id ────▶  Server
      │                                      │
      │                          contract.status → 3 (Đã hủy)
      │                          room.status → 0 (Trống)
      │                          user.room_id → null
      │                                      │
      │  ◀──── { message: "Đã hủy" } ─────  │
      └──────────────────────────────────────┘
```

---

## 9. Giao diện người dùng (Frontend Pages)

### 9.1. Trang Admin (`/admin/*`)

| Đường dẫn          | Component    | Chức năng                                    |
| ------------------- | ------------ | -------------------------------------------- |
| `/admin`            | Dashboard    | Thống kê tổng quan hệ thống                 |
| `/admin/rooms`      | Rooms        | Quản lý tất cả phòng (bao gồm đã xóa)      |
| `/admin/users`      | Users        | Quản lý danh sách người thuê                |
| `/admin/masters`    | Masters      | Quản lý danh sách chủ trọ                   |
| `/admin/contracts`  | Contracts    | Kiểm duyệt tất cả hợp đồng                 |

### 9.2. Trang Master (`/master/*`)

| Đường dẫn               | Component       | Chức năng                              |
| ------------------------- | --------------- | -------------------------------------- |
| `/master`                 | MasterDashboard | Dashboard cá nhân (doanh thu, thống kê)|
| `/master/rooms`           | MasterRooms     | Quản lý phòng của mình                |
| `/master/rooms/add`       | RoomFormPage    | Thêm phòng mới                        |
| `/master/rooms/edit/:id`  | RoomFormPage    | Sửa thông tin phòng                    |
| `/master/contracts`       | SharedContracts | Xét duyệt yêu cầu thuê               |
| `/master/profile`         | MasterProfile   | Cập nhật hồ sơ cá nhân                |

### 9.3. Trang Tenant (`/user/*`)

| Đường dẫn           | Component       | Chức năng                            |
| --------------------- | --------------- | ------------------------------------ |
| `/user`               | TenantDashboard | Dashboard cá nhân                    |
| `/user/rooms`         | TenantRooms     | Tìm kiếm & lọc phòng trống         |
| `/user/rooms/:id`     | RoomDetailPage  | Xem chi tiết & đặt phòng            |
| `/user/contracts`     | SharedContracts | Theo dõi hợp đồng cá nhân           |
| `/user/profile`       | TenantInfo      | Cập nhật thông tin cá nhân           |

### 9.4. Component dùng chung

| Component           | Vị trí                         | Chức năng                                |
| -------------------- | ------------------------------ | ---------------------------------------- |
| `DeleteConfirmModal` | `components/Common/`           | Modal xác nhận xóa thay thế `window.confirm` |
| `ProtectedRoute`     | `components/Guards/`           | Bảo vệ route theo role                  |
| `RoleDirector`       | `components/Guards/`           | Điều hướng về dashboard đúng role        |
| `AdminLayout`        | `components/Layouts/`          | Layout + Sidebar cho Admin               |
| `MasterLayout`       | `components/Layouts/`          | Layout + Sidebar cho Master              |
| `UserLayout`         | `components/Layouts/`          | Layout + Sidebar cho Tenant              |
| `SharedContracts`    | `pages/Common/Contracts/`      | Trang hợp đồng dùng chung (Master + User)|

---

## 10. Cách chạy dự án

### 10.1. Yêu cầu hệ thống

- **Node.js** >= 18
- **PostgreSQL** >= 15
- **npm** hoặc **yarn**

### 10.2. Cài đặt & chạy Backend

```bash
cd rental-managerment/backend

# Cài đặt dependencies
npm install

# Tạo file .env với các biến môi trường
# DATABASE_URL=postgresql://user:password@localhost:5432/rental_db
# JWT_SECRET=your_secret_key
# CLOUDINARY_CLOUD_NAME=xxx
# CLOUDINARY_API_KEY=xxx
# CLOUDINARY_API_SECRET=xxx

# Chạy server (port 3000)
npm run dev
```

### 10.3. Cài đặt & chạy Frontend

```bash
cd rental-managerment/frontend/my-react-app

# Cài đặt dependencies
yarn install   # hoặc npm install

# Chạy dev server (port 5173)
yarn dev       # hoặc npm run dev
```

### 10.4. Truy cập ứng dụng

| URL                        | Mô tả              |
| --------------------------- | ------------------- |
| `http://localhost:5173`     | Frontend (React)    |
| `http://localhost:3000/api` | Backend API         |

---

## 11. Các vấn đề đã giải quyết & bài học kinh nghiệm

### 11.1. Lỗi đăng nhập trình duyệt khác (Cross-Browser Login Issue)

- **Hiện tượng**: Tài khoản cũ đăng nhập được ở trình duyệt A nhưng không được ở trình duyệt B.
- **Nguyên nhân gốc**: Tài khoản cũ trong Database thiếu liên kết profile (`userId`/`masterId` = null), dẫn đến `profileId` trả về null. Trình duyệt A dùng cookie phiên cũ nên vẫn vào được. Trình duyệt B phải đăng nhập mới → bị chặn bởi kiểm tra `profileId` ở Frontend.
- **Giải pháp**: Gán `profileId = account.id` làm dự phòng cho Admin tại cả 2 tầng: `auth.service.js` (tạo Token) và `auth.dto.js` (đóng gói phản hồi).

### 11.2. Lỗi 404 do xung đột Route (Route Conflict)

- **Hiện tượng**: API `/rooms/admin/all` và `/rooms/master/:id` trả về 404.
- **Nguyên nhân**: Route `/:id` (tham số động) nằm trước các route cố định, khiến Express coi chữ `"admin"` và `"master"` là giá trị ID.
- **Giải pháp**: Sắp xếp lại thứ tự route — route cố định nằm trước, route tham số động (`/:id`) nằm cuối.

### 11.3. Lỗi hiển thị dữ liệu sau phân trang (Pagination Data Mismatch)

- **Hiện tượng**: Master lấy được hợp đồng nhưng không hiển thị.
- **Nguyên nhân**: Backend trả về object `{ contracts: [], total, totalPages }` nhưng Frontend vẫn đọc theo kiểu mảng cũ `res.data` thay vì `res.data.contracts`.
- **Giải pháp**: Cập nhật Frontend để bóc tách đúng cấu trúc dữ liệu phân trang.

---

## 13. Hệ thống Excel Import & Export

Hệ thống Import/Export được thiết kế để xử lý lô dữ liệu lớn một cách an toàn và chuyên nghiệp.

### 13.1. Kiến trúc Import 3 lớp (Backend)

Sử dụng mô hình phân tách trách nhiệm cao:
1.  **Entry Service (`index.js`)**: Nhận dữ liệu JSON từ Frontend, điều phối quá trình kiểm tra và lưu trữ.
2.  **Validator Layer (`validator.js`)**: 
    - Kiểm tra cấu trúc nội bộ file (trùng lặp roomNumber trong file).
    - Đối soát dữ liệu địa chính thực tế (API Provinces).
    - Kiểm tra xung đột logic với Database (SĐT/Email đã tồn tại).
    - Log chi tiết full dữ liệu dòng lỗi để debug.
3.  **Storage Layer (`storage.js`)**: 
    - Thực thi trong một **Database Transaction** duy nhất (Nguyên tử hóa).
    - **Identity Resolution**: Tự động giải quyết định danh Master/Tenant dựa trên SĐT/Email.
    - **Auto-Account**: Tự động tạo Account cho người dùng mới kèm mật khẩu mặc định.

### 13.2. Sơ đồ luồng (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as Admin (Frontend)
    participant V as Validator (Back)
    participant S as Storage (Back)
    participant DB as Database

    U->>U: Map Header động & Parse Excel
    U->>V: Gửi danh sách Rows
    V->>V: Kiểm tra logic & Địa chính
    V->>DB: Kiểm tra SĐT/Email tồn tại
    
    ALT Dữ liệu lỗi
        V-->>U: Trả về lỗi chi tiết + Log Terminal
    ELSE Dữ liệu sạch
        V->>S: Chuyển dữ liệu đã kiểm tra
        S->>DB: Bắt đầu TRANSACTION
        S->>DB: Tạo/Link Master & Tenant
        S->>DB: Lưu Room & Contract
        S->>DB: COMMIT TRANSACTION
        S-->>U: Trả về Thành công + RecentData
    END
    U->>U: Hiển thị popup "Thay đổi gần nhất"
```

### 13.3. Các tính năng cao cấp
- **Header Mapping động**: Không phụ thuộc vào thứ tự cột trong file Excel, hệ thống tìm cột theo tên nhãn.
- **Recent Changes Popup**: Lưu lại các dòng vừa import thành công trong phiên làm việc để Admin đối soát nhanh qua nút "Thay đổi gần nhất".
- **Export đồng bộ**: File Excel xuất ra có định dạng cột và nhãn tiêu đề (labels) khớp hoàn toàn với mẫu file Import, hỗ trợ quy trình "Xuất -> Sửa -> Nhập" mượt mà.

---

## 14. Hướng phát triển tiếp theo

- [x] Triển khai hệ thống Excel Import/Export chuyên sâu.
- [ ] Tạo API thống kê chuyên biệt (`/api/stats`) cho Dashboard.
- [ ] Thêm chức năng khôi phục phòng/hợp đồng đã xóa mềm cho Admin.
- [ ] Áp dụng giao diện Tailwind CSS cho trang Tenant (Người thuê).
- [ ] Thêm chức năng tìm kiếm nâng cao (lọc theo giá, diện tích, tiện ích).
- [ ] Triển khai hệ thống thông báo thời gian thực (WebSocket/SSE).
- [ ] Tích hợp thanh toán trực tuyến (VNPay/Momo).
