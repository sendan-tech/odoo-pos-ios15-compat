{
    'name': 'POS iOS 15 Emulation (TEST ONLY - never install in production)',
    'version': '19.0.1.0.0',
    'summary': 'Removes browser features Safari 15.6 lacks, to reproduce iPad Air 2 behaviour on a modern browser',
    'author': 'Sendan',
    'license': 'LGPL-3',
    'depends': ['point_of_sale'],
    'assets': {
        'point_of_sale._assets_pos': [('prepend', 'pos_ios15_emulate/static/src/strip.js')],
        'web.assets_backend': [('prepend', 'pos_ios15_emulate/static/src/strip.js')],
    },
    'installable': True,
}
