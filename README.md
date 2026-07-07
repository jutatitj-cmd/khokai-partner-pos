# KHOKAI Partner POS V17.0.8.5

Hotfix: บันทึกจัดลังให้เข้ากับ schema ที่รันไปแล้ว

- ใช้ `khokai_order_boxes`
- ใช้ `khokai_order_box_items`
- บันทึกแบบ minimal columns เพื่อลด error จาก column ไม่ตรง
- ถ้า Supabase ไม่รับ จะยังเก็บในเครื่องก่อน

Commit message:

```text
V17.0.8.5 box save schema hotfix
```
