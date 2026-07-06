# KHOKAI Partner POS V17 Mini UI Fork

Fork จาก Mini POS V16.3.5 เพื่อให้ UI เหมือน Mini POS มากที่สุด

ตัดออกก่อน:
- 거래명세서
- Export ภาษี

เพิ่มเฉพาะงาน Partner:
- ตารางออเดอร์แยก `khokai_partner_orders`
- Product settings แยก `partner_product_settings`
- Partner master `partner_master`
- ดึง `product_options` ทั้งหมด แล้วเปิดขายบาง option ใน Partner POS
- ชื่อเกาหลีใช้ `pick_name`
- ชื่อไทยใช้ `pick_name_th` จาก `partner_product_settings`
- ราคาส่งและจำนวนถุง/ลังเก็บใน `partner_product_settings`

## Deploy
อัป `index.html` และ `README.md` ทับ GitHub เดิม แล้ว Commit

Commit message:
`V17 fork from Mini POS UI`
