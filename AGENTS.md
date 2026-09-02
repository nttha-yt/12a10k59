# Quy Tắc Dự Án Lớp 12A10 - THPT Yên Thế

## 1. Tự Động Commit Sau Mỗi Thay Đổi (Auto-Commit)
- Sau khi hoàn thành bất kỳ tác vụ chỉnh sửa mã nguồn, cập nhật tính năng hoặc sửa lỗi nào trong dự án này, **BẮT BUỘC** phải tự động tạo git commit và đẩy (push) lên GitHub (`git add .`, `git commit -m "..."`, `git push origin main`) mà không cần đợi người dùng yêu cầu lại.
- Thông điệp commit cần ngắn gọn, rõ ràng theo chuẩn Conventional Commits (ví dụ: `feat: ...`, `fix: ...`, `style: ...`, `refactor: ...`).

## 2. Công Nghệ & Tiêu Chuẩn
- Framework: React 19 + TypeScript + Vite + Tailwind CSS v4.
- Luôn hỗ trợ đầy đủ 2 chế độ: **Dark Theme (Tối) 🌙** và **Light Theme (Sáng) ☀️**.
- Giữ vững tính tương thích của Recharts và các Modal trong cả 2 theme.
- Khi chạy build hoặc script trên Windows PowerShell, luôn dùng `npm.cmd` hoặc `npx.cmd`.
