var NE = require('nuby-express');
var util = require('util');
var _ = require('underscore');
var fs = require('fs');
var _template_content;
var _template;
var ejs = require('ejs');

var _msg_types =['info', 'error', 'warning'];

function _flash_messages(rs) {
    var messages = [];

    var self = this;
    _msg_types.forEach(function (type) {
        var m_list = rs.flash(type);
       // console.log('messages for %s = %s', type, util.inspect(m_list));
        if (m_list && m_list.length) {
            messages.push({type:type, messages:m_list});
        }
    });

    return messages;
}

function _render(rs) {
    var message_sets = _flash_messages(rs);

    var count = _.reduce(message_sets, function(c, s){
        return c + s.messages.length;
    }, 0);

    return _template({messages: message_sets, count: count});
}

var _flash_view_helper = new NE.helpers.View( {
    name: 'flash',

    init: function(rs, input, cb){
        /**
         * Transferring form/querystring props to flash messages
         */
        _msg_types.forEach(function(mt){
            if (rs.req_props['flash_' + mt]){
                rs.flash(mt, rs.req_props['flash_' + mt]);
            }
        });

        if (!input.hasOwnProperty('helpers')){
            input.helpers = {};
        }
        input.helpers.flash = function(){
             return _render(rs);
        }

        if (_template){
            cb(null, input);
        } else {
            fs.readFile(__dirname + '/flash.html', 'utf8', function(err, c){
                _template = ejs.compile(c);
                cb(null, input);
            })
        }
    }

});

module.exports = function () {
    return _flash_view_helper;
}