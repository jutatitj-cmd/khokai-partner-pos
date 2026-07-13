-- box_rules was serving two unrelated purposes off the same rows, which collided when the
-- weight-based 로젠 shipping-cost tiers (W1-W4) were added:
--   1. box_guide  -- what box size + how many ice packs the packing floor should prepare
--                     (3KG/3KG_SPECIAL/10KG/20KG, unrelated to what we actually pay the courier)
--   2. shipping_cost -- the real weight-tier rate we pay 로젠 (W1-W4)
-- Split them with an explicit column so each feature only reads its own rows.

alter table public.box_rules add column if not exists purpose text not null default 'box_guide';

update public.box_rules set purpose = 'shipping_cost' where box_code in ('W1','W2','W3','W4');
update public.box_rules set purpose = 'box_guide' where box_code in ('3KG','3KG_SPECIAL','10KG','20KG');

-- restore the box/ice-pack guidance rows the packing floor uses -- these were deactivated by
-- mistake when the shipping-cost tiers were added, but they're a separate concern and still needed
update public.box_rules set active = true where box_code in ('3KG','3KG_SPECIAL','10KG','20KG');
