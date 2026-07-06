# KHOKAI Partner POS V17.0.3

Fork from Mini POS UI. Scope is small: quick partner orders, temporary save, customer copy message, shared login/orders with Mini POS.

## V17.0.3 changes
- Quick order UI follows Mini POS style.
- Price Tier buttons on quick order: ① ② ③ ④.
- Payment method buttons: 🏦 transfer, 💵 cash, 📒 credit.
- Customer message is no longer shown on the first page. Use 🇹🇭 / 🇰🇷 popup with Copy and Close.
- Product settings support Thai name, Korean name, T1-T4 prices, pieces per box, enabled/disabled.
- Product price on quick order follows selected Tier and is saved in the order payload.
- Orders still save to shared `khokai_pos_orders` with `app_mode/order_type/sales_channel = PARTNER`.

## Commit message
V17.0.3 tier payment bilingual popup
