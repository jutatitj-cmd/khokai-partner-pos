# KHOKAI Partner POS V17.0.2

Fork จาก Mini POS UI V16.3.5

## แนวทาง
- ใช้ UI / flow แบบ Mini POS ให้คุ้นมือที่สุด
- ใช้ตาราง login เดียวกับ Mini POS: `khokai_pos_users`
- ใช้ตารางออเดอร์เดียวกับ Mini POS: `khokai_pos_orders`
- ไม่สร้าง `khokai_partner_orders` แล้ว
- แยก Partner order ด้วย payload:
  - `app_mode = PARTNER`
  - `order_type = PARTNER`
  - `sales_channel = PARTNER`
- Mini POS ยังใช้งานต่อได้ ไม่แตะตารางเดิม

## อัปเดตจากรอบก่อน
- แก้ error ไม่มีตาราง `khokai_partner_orders`
- Partner POS จะอ่านเฉพาะออเดอร์ที่เป็น Partner จาก `payload`
- ออเดอร์ใหม่ใช้ id ขึ้นต้น `p_`
