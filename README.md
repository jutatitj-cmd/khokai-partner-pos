# KHOKAI ERP Lite - Partner POS V2.1.5

Hotfix & quick order cleanup.

## Changed
- หน้าแรกเปลี่ยนเป็น เปิดออเดอร์ด่วน
- เอาค้นหา SKU / 옵션ID ออกจากหน้าแรก
- ชื่อสินค้าในหน้าเปิดด่วนใช้ชื่อไทยเท่านั้น
- หน่วยสินค้าเปลี่ยนเป็น ถุง / ลัง แบบปุ่ม
- จำนวนมี 1,2,3,5,10 และ + / -
- Copy closing message แก้ error แล้ว
- ข้อความปิดการขายเว้นวรรคใหม่ ไทย/เกาหลี
- ค่าส่งดึงจาก v_box_rules
- น้ำหนักดึงจาก v_product_options หรือ product_option
- จำนวนต่อลังใช้เกณฑ์เดียว box_qty
- กรอกหลังโอนแก้ ReferenceError แล้ว
- บันทึกออเดอร์ชั่วคราวลง Supabase ตาราง khokai_partner_orders แยกจาก Mini POS

## Supabase
Run supabase/schema.sql if using cloud save.
