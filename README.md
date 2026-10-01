# NGUYEN THUY HIEN - 23702281 - https://github.com/nguyenthuyhien/23702281_TH2.git - Stamp: #893424 - Số cuối: 1 - VARIANT: Watermark Dưới | Login phone | Tab Shop→Giỏ→Tôi | Haptic selection | Phí B | Detail card

# KTXGo - Dịch Vụ Giao Đồ Tận Phòng Ký Túc Xá

Ứng dụng React Native phục vụ sinh viên ký túc xá đặt món, ước tính phí giao hàng theo khoảng cách GPS và quản lý giỏ hàng tận phòng.

---

## 1. Thông Tin Sinh Viên & Biến Thể Đề Thi

- **Họ và tên:** NGUYEN THUY HIEN
- **MSSV:** 23702281
- **Số cuối MSSV:** 1
- **Student Seed:** 281
- **Exam Stamp:** `#893424` (tính từ `TH2|23702281|NGUYEN THUY HIEN`)
- **Phòng giao mặc định (ROOM_LABEL):** `P.381`
- **Thời gian Debounce tìm kiếm (DEBOUNCE_MS):** `400 ms`
- **Thời gian Stale React Query (STALE_TIME_MS):** `11.000 ms`
- **Hệ số giá quy đổi (PRICE_MULTIPLIER):** `15.500`
- **Phí ship cơ bản (BASE_SHIP_FEE):** `9.000 đ`
- **Cấu hình VARIANT (Số cuối = 1):**
  - **Watermark:** Dưới màn hình (`watermarkAtTop = false`)
  - **Ô Login:** Số điện thoại (`authField = 'phone'`)
  - **Thứ tự Tab:** Cửa hàng → Giỏ → Tôi (`tabOrder = 'shopFirst'`)
  - **Haptic khi thêm giỏ:** `selection` (`hapticOnAdd = 'selection'`)
  - **Công thức tính phí ship:** Công thức B: `BASE_SHIP_FEE + Math.round(km * 1500) + 2000`
  - **Detail Presentation:** Card trong Stack (`detailPresentation = 'card'`)

---

## 2. Cấu Trúc Dự Án

```
KTXGo_23702281/
├── README.md
├── App.tsx
├── package.json
├── babel.config.js
├── tsconfig.json
├── docs/
│   ├── screenshot-th2-home.png
│   └── screenshot-th2-cart.png
└── src/
    ├── constants/
    │   ├── student.ts
    │   └── theme.ts
    ├── hooks/
    │   ├── useDebouncedValue.ts
    │   └── useCampusLocation.ts
    ├── services/
    │   ├── apiClient.ts
    │   └── productApi.ts
    ├── stores/
    │   ├── authStore.ts
    │   └── cartStore.ts
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── AuthStack.tsx
    │   ├── MainTabs.tsx
    │   └── ShopStack.tsx
    ├── components/
    │   ├── ProductCard.tsx
    │   └── Watermark.tsx
    └── screens/
        ├── LoginScreen.tsx
        ├── HomeScreen.tsx
        ├── DetailScreen.tsx
        ├── CartScreen.tsx
        └── MeScreen.tsx
```

---

## 3. Các Tính Năng Đã Hoàn Thiện

### Câu 1: Điều hướng & Định danh (3.0 điểm)
- ✅ Cấu hình alias `@screens`, `@components`, `@constants`, `@services`, `@stores`, `@hooks`, `@navigation` trong cả `babel.config.js` và `tsconfig.json`.
- ✅ File `student.ts` đầy đủ seed, công thức, VARIANT, và hàm băm `examStamp()`.
- ✅ Kiến trúc điều hướng phân tầng: `RootNavigator` chuyển đổi giữa `AuthStack` (khi chưa đăng nhập) và `MainTabs` (khi đã có token).
- ✅ Màn hình `LoginScreen` với ô nhập số điện thoại (`phone`) theo đúng số cuối 1, tạo fake token `ktxgo-23702281-893424`.
- ✅ Thứ tự Tabs: Cửa hàng → Giỏ → Tôi (`shopFirst`).
- ✅ `tabBarBadge` phản ánh tổng số lượng món trong giỏ hàng (tự ẩn khi giỏ rỗng = 0).
- ✅ `Watermark` hiển thị dòng định danh `TH2 · 23702281 · NGUYEN THUY HIEN · #893424` ở đáy mọi màn hình.

### Câu 2: FlashList Lưới 2 Cột & React Query (3.0 điểm)
- ✅ `HomeScreen` hiển thị danh sách dạng lưới 2 cột (`numColumns={2}`), `estimatedItemSize={220}`, không bọc ngoài bằng ScrollView dọc.
- ✅ Key của mỗi item ghép mã số sinh viên: `${STUDENT.mssv}-${item.id}`.
- ✅ Ô tìm kiếm controlled debounce `400ms` với `useDebouncedValue`.
- ✅ Đầy đủ 3 trạng thái mạng:
  1. **Đang tải:** Hiển thị `ActivityIndicator` và text "Đang tải món...".
  2. **Có dữ liệu:** Hiển thị lưới `ProductCard`.
  3. **Lỗi mạng:** Hiển thị MSSV đỏ `23702281`, thông báo lỗi và nút "Thử lại" gọi `refetch()`.
- ✅ Pull-to-refresh tích hợp với `refetch()`.
- ✅ Chuyển tiếp mượt mà sang `DetailScreen` truyền `id`.

### Câu 3: Zustand Persist & Location GPS / Haptic (4.0 điểm)
- ✅ `cartStore` xây dựng bằng Zustand kết hợp `persist` qua `@react-native-async-storage/async-storage` với key lưu trữ `ktxgo-cart-23702281`.
- ✅ Thêm sản phẩm từ `HomeScreen` (+) và `DetailScreen` (Thêm vào giỏ) đồng bộ vào giỏ hàng.
- ✅ Rung phản hồi Haptic kiểu `selection` đúng biến thể.
- ✅ `CartScreen` hiển thị danh sách món, tổng tiền, `ROOM_LABEL: P.381`, xóa món và phản ánh phí ship.
- ✅ Hook `useCampusLocation` xử lý 3 nhánh quyền: `granted`, `denied`, `blocked`.
- ✅ Xử lý khi bị chặn quyền vĩnh viễn (blocked) chuyển sang `Linking.openSettings()`.
- ✅ Tính khoảng cách Haversine tới cổng KTX (`10.8222, 106.6875`) và áp dụng công thức phí B:
  `BASE_SHIP_FEE + Math.round(km * 1500) + 2000`.
- ✅ Màn hình `MeScreen` hiển thị phí ship, khoảng cách, thông tin sinh viên và nút Đăng xuất.

---

## 4. Hướng Dẫn Chạy Ứng Dụng

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

2. Khởi động Metro Bundler:
   ```bash
   npm start
   ```

3. Chạy trên thiết bị hoặc máy ảo:
   - Android: `npm run android`
   - iOS: `npm run ios`
