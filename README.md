# KHOKAI ERP Lite V2.1.1

เพิ่มจาก V2.1

- เชื่อม Supabase ตาราง `product_option`
- Product Master ดึงชื่อสินค้า / SKU / 옵션ID / 노출상품ID จาก Supabase
- OMS Export ใส่ `옵션ID` และ `노출상품ID`
- ข้อความส่งลูกค้า 2 ภาษา ไทย + เกาหลี
- ปุ่มแจ้งเลขพัสดุ 2 ภาษา
- เพิ่ม schema `message_templates` สำหรับต่อยอด Quick Reply

วิธีใช้ Supabase

1. Deploy ขึ้น Netlify
2. เปิดเว็บ > กด `ตั้งค่า`
3. ใส่ Supabase Project URL
4. ใส่ Supabase anon key
5. ระบบจะ Sync ตาราง `product_option`

ถ้ายังไม่ใส่ Supabase ระบบจะใช้ข้อมูลทดลองใน LocalStorage ต่อได้


## V2.1.2
- หน้าแรกเป็นปิดออเดอร์ด่วนเหมือน Mini POS
- บันทึกออเดอร์ชั่วคราวก่อน แล้วค่อยกรอก Partner / ข้อมูลโอน / เลขพัสดุ
- ข้อความปิดการขาย 2 ภาษา พร้อมวันจัดส่งและลิงก์ติดตามสถานะ
- Product Master ดึงจาก Supabase `product_option`
- รองรับจำนวนต่อลังแยกแบบพัสดุและรถส่งถึงที่: `parcel_box_qty`, `truck_box_qty`
- OMS เพิ่ม 배송예정일, 배송방법, 상태링크
