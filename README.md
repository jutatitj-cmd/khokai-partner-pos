# KHOKAI Partner POS V2.2.0

- Sync จาก `product_options` ทั้งหมดก่อน (`product_option` / `v_product_options` เป็น fallback)
- Product Master เลือกเปิดขายเฉพาะ option ที่ใช้ใน Partner POS
- ชื่อเกาหลีใช้ `pick_name`
- ชื่อไทยใช้คอลัมน์ใหม่ `pick_name_th` ก่อน แล้วค่อย fallback อื่น
- Quick Order แสดงเฉพาะสินค้าที่เปิดขายในโมดูลนี้

Commit message:

```text
V2.2.0 product options sale toggle
```


## V2.2.0
- Supabase settings hidden from UI; connection can be embedded once in code.
- Product Master ดึง `product_options` ทั้งหมด แล้วเปิด/ปิดขายใน Partner POS เอง
- ชื่อเกาหลีใช้ `pick_name`
- ชื่อไทยใช้ `pick_name_th` / `partner_pick_name_th` สำหรับชื่อสินค้าสั้น ไม่ใช่ชื่อ option
- แก้ชื่อไทยและจำนวนต่อกล่อง/ลังจากหน้า Product Master ได้
- บันทึกกลับ `product_options`: `pick_name_th`, `partner_pos_enabled`, `partner_box_qty`
