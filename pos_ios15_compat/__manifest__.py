{
    'name': 'POS Legacy iPad Support (iOS 15)',
    'version': '19.0.1.0.0',
    'category': 'Sales/Point of Sale',
    'summary': 'Run Odoo 19 Point of Sale on older iPads (iPad Air 2, iPadOS 15 / Safari 15)',
    'description': """
Odoo 19 Point of Sale uses browser features that Safari 15 (iPadOS 15, e.g. iPad Air 2,
iPad mini 4, iPad 5th gen) does not have, so the register never finishes loading and
Epson ePOS receipts cannot print. This module adds guarded polyfills for those features:
Array.prototype.toSorted/toReversed/toSpliced/with, AbortSignal.timeout/any,
Set.prototype.union/intersection/difference/symmetricDifference/isSubsetOf/isSupersetOf/isDisjointFrom,
Object.groupBy, Map.groupBy, Promise.withResolvers, Array.fromAsync.
Every polyfill only installs when the browser lacks the feature; modern browsers are unaffected.
""",
    'author': 'Sendan',
    'maintainer': 'Sendan',
    'website': 'https://github.com/sendan-tech/odoo-pos-ios15-compat',
    'license': 'LGPL-3',
    'price': 0.0,
    'currency': 'EUR',
    'depends': ['point_of_sale'],
    'assets': {
        # Right after the module loader: before any Odoo module code executes.
        'point_of_sale._assets_pos': [
            ('after', 'web/static/src/module_loader.js', 'pos_ios15_compat/static/src/polyfills.js'),
        ],
        'point_of_sale.customer_display_assets': [
            ('prepend', 'pos_ios15_compat/static/src/polyfills.js'),
        ],
        'web.assets_backend': [
            ('after', 'web/static/src/module_loader.js', 'pos_ios15_compat/static/src/polyfills.js'),
        ],
    },
    'images': ['static/description/banner.png'],
    'installable': True,
    'application': False,
    'auto_install': False,
}
