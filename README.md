# KHOKAI Partner POS V17.0.8.4

Base: V17.0.8.x stable line.

## Changes
- Add real box/shipment structure for Partner POS without using existing `khokai_shipments`.
- New tables:
  - `khokai_order_boxes`
  - `khokai_order_box_items`
- Supports one order with multiple boxes, different ship dates, different tracking numbers, and multiple SKU per box.
- Adds `📦 จัดลัง / Shipment` section in order detail page.
- Keeps orders in `khokai_pos_orders` with `order_module = partner_pos`.
- Does not touch Mini POS order flow.

## Why not use khokai_shipments
Existing `khokai_shipments` has `unique(order_no)`, so it only supports one shipment per order. Partner POS needs multiple boxes per order.

## Deploy
Upload all files to GitHub root and commit:

```text
V17.0.8.4 order boxes shipments
```

Then run SQL from Settings once if new tables do not exist.
