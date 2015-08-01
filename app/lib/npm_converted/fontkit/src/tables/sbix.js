/*
 * Don't edit this file by hand!
 * This file was generated from a npm-package using gulp. 
 * For more information see gulpfile.js in the project root
 */
define(function (require, exports, module) {// Generated by CoffeeScript 1.8.0
(function() {
  var ImageTable, r;

  r = require('restructure');

  ImageTable = new r.Struct({
    ppem: r.uint16,
    resolution: r.uint16,
    imageOffsets: new r.Array(new r.Pointer(r.uint32, 'void'), function() {
      return this.parent.parent.maxp.numGlyphs + 1;
    })
  });

  module.exports = new r.Struct({
    version: r.uint16,
    flags: new r.Bitfield(r.uint16, ['renderOutlines']),
    numImgTables: r.uint32,
    imageTables: new r.Array(new r.Pointer(r.uint32, ImageTable), 'numImgTables')
  });

}).call(this);

});
