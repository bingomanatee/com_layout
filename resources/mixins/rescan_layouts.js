var NE = require('nuby-express');
var util = require('util');
var _DEBUG = false;
var Gate = NE.deps.support.Gate;
var Layout_Dir_Handler_factory = require('Layout/handlers/Layout_Dir');

module.exports = {
    init:function (frame, cb) {
        var gate = new Gate(cb, 'rescan layouts');

        if (_DEBUG) console.log('REASCANNING LAYOUT FOR FRAME %s', frame.path);

        function _after_load(loader) {
            if (_DEBUG)  console.log('ldh: loader %s', util.inspect(loader));
            var layouts = loader.get_resources();
            if (_DEBUG) console.log('%s LAYOUTS LOADED from %s', layouts.length, loader.path);
            frame.add_resources(layouts);
            gate.task_done()
        }

        frame.get_controllers().forEach(function (con) {
            var layout_dir_handler = Layout_Dir_Handler_factory();
            gate.task_start();
            con.reload([layout_dir_handler], _after_load, frame);
        })

        frame.get_components().forEach(function (con) {
            var layout_dir_handler = Layout_Dir_Handler_factory();
            gate.task_start();
            con.reload([layout_dir_handler], _after_load, frame);
        })

        var layout_dir_handler = Layout_Dir_Handler_factory();
        gate.task_start();
        frame.reload([layout_dir_handler], _after_load, frame);
        gate.start(); //   console.log('scanning %s', frame.path);
    }
}