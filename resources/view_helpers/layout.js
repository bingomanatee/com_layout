var NE = require('nuby-express');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;
var _DEBUG_OPTIONS = false;

var _layout_view = new NE.helpers.View({
        name:'layout_seletor',

        init:function (rs, input, cb) {
            if (_DEBUG) console.log('INIT LAYOUT');
            var layout_options = false;

            function _fetch_layout(key) {
                if (!key) {
                    input.layout = false;
                } else {
                    //   console.log('desiring layout %s', key);
                    var layout = rs.framework.get_resource('layout', key);
                    if (layout) {

                        if ((!layout.resource_read) && ( rs.action.models.site_options)) {
                            var site_options = rs.action.models.site_options;
                            site_options.read_resource_options(layout);
                            layout.resource_read = true;
                        }

                        if (_DEBUG) console.log('found layout %s: template = %s, path = %s', key, layout.template, rs.req.url);
                        input.layout = layout.template;
                        layout_options = layout.config.options;
                    }
                    else {
                        throw new Error('cannot find layout %s', key);
                    }
                }
            }

            if (_DEBUG) console.log('input for layout view: %s', util.inspect(input));


            if (input.hasOwnProperty('layout_name') && input.layout_name) {
                if (_DEBUG) console.log('INIT LAYOUT: looking for layout (from input choice) %s', input.layout_name);
                _fetch_layout(input.layout_name);
            } else {
                ln = rs.action.get_config('layout_name', 'NO LAYOUT')
                if (_DEBUG) console.log('INIT LAYOUT: looking for layout %s', ln);

                if (ln != 'NO LAYOUT') {
                    if (_DEBUG) {
                        // console.log('found layout %s for %s', ln, rs.req.url)
                    }

                    if (ln) {
                        _fetch_layout(ln);
                    } else {
                        input.layout = false;
                    }
                }
            }

            if (layout_options) {
                if (_DEBUG_OPTIONS)   console.log('options: %s', util.inspect(layout_options));


                function _package_layout_options(err, site_options) {
                    if (!input.layout_options) {
                        input.layout_options = {};
                    }
                    _.each(layout_options, function (lopt) {
                        if (_DEBUG_OPTIONS) {
                            console.log('setting option %s FROM %s', lopt.name, util.inspect(site_options));
                        }
                        input.layout_options[lopt.name] = site_options[lopt.name];

                    });
                    cb(null, input);
                }

                var site_options = rs.action.models.site_options.get_cache();

                if (site_options) {
                    _package_layout_options(null, site_options);
                } else {
                    rs.action.models.site_options.get_cache(_package_layout_options);
                }


            } else {
                if (_DEBUG_OPTIONS)   console.log('NOT setting debug options - no layout')
                cb(null, input);
            }

        }

    });

module.exports = function () {
    return _layout_view;
}