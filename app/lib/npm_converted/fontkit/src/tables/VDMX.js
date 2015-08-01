/*
 * Don't edit this file by hand!
 * This file was generated from a npm-package using gulp. 
 * For more information see gulpfile.js in the project root
 */
define(function (require, exports, module) {// Generated by CoffeeScript 1.8.0
(function() {
  var Ratio, VdmxGroup, r, vTable;

  r = require('restructure');

  Ratio = new r.Struct({
    bCharSet: r.uint8,
    xRatio: r.uint8,
    yStartRatio: r.uint8,
    yEndRatio: r.uint8
  });

  vTable = new r.Struct({
    yPelHeight: r.uint16,
    yMax: r.int16,
    yMin: r.int16
  });

  VdmxGroup = new r.Struct({
    recs: r.uint16,
    startsz: r.uint8,
    endsz: r.uint8,
    entries: new r.Array(vTable, 'recs')
  });

  module.exports = new r.Struct({
    version: r.uint16,
    numRecs: r.uint16,
    numRatios: r.uint16,
    ratioRanges: new r.Array(Ratio, 'numRatios'),
    offsets: new r.Array(r.uint16, 'numRatios'),
    groups: new r.Array(VdmxGroup, 'numRecs')
  });

}).call(this);

});
