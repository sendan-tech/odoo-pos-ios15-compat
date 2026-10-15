# POS Legacy iPad Support (iOS 15) for Odoo 19

Run **Odoo 19 Point of Sale** on iPads stuck at **iPadOS 15** (iPad Air 2, iPad mini 4, iPad 5th gen) — Safari 15.6, and also Chrome / the Odoo app on those devices, which use the same engine.

## Why

Odoo 19 POS uses JavaScript features added in Safari 16–17.4. On iPadOS 15:

| Missing feature | Used by Odoo 19 in | Symptom |
|---|---|---|
| `Set.prototype.difference` (Safari 17) | POS local IndexedDB init | Register stuck on loading |
| `Array.prototype.toReversed` / `toSorted` (Safari 16) | `account/static/src/helpers/account_tax.js` | Prices / taxes crash |
| `AbortSignal.timeout` (Safari 16) | `epson_printer.js` | Every ePOS receipt print fails |

This module loads guarded polyfills right after `web/static/src/module_loader.js` in `point_of_sale._assets_pos` and `web.assets_backend` (and at the start of `point_of_sale.customer_display_assets`). Each polyfill only installs if the browser lacks the feature.

## Install

1. Add this repository to your addons path (branch `19.0`).
2. Install **POS Legacy iPad Support (iOS 15)** (`pos_ios15_compat`).
3. On each iPad, close the POS tab and reopen it.

## Epson ePOS printing on iPad

* The iPad must trust the printer's HTTPS certificate (iOS requires a certificate with the printer IP in `subjectAltName` and ≤ 825 days validity; install your CA and enable it in *Settings → General → About → Certificate Trust Settings*).
* The system parameter `point_of_sale.use_lna` must not exist — Odoo's Local Network Access mode is Chromium-only. Note that the value `False` is a non-empty string and still enables it; delete the parameter instead.

## Testing without an old iPad

`tools/pos_ios15_emulate` (**test only — never install in production**) deletes the Safari 16+ APIs at the very start of the POS and backend bundles, so a modern browser behaves like iPadOS 15:

```bash
# put tools/ on the addons path of a throw-away database, then
odoo -d test -i point_of_sale,pos_ios15_emulate --with-demo --stop-after-init   # control: POS hangs
odoo -d test -i pos_ios15_compat --stop-after-init                              # fix: POS works
```

It is not a substitute for the real WebKit 15 engine (CSS/layout quirks) — pilot on one real device.

## License

LGPL-3. © Sendan.
