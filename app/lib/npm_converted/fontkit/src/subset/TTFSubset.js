/*
 * Don't edit this file by hand!
 * This file was generated from a npm-package using gulp. 
 * For more information see gulpfile.js in the project root
 */
define(function (require, exports, module) {// Generated by CoffeeScript 1.8.0
(function() {
  var Directory, Subset, TTFSubset, Tables, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  Subset = require('./Subset');

  Directory = require('../tables/directory');

  Tables = require('../tables');

  TTFSubset = (function(_super) {
    __extends(TTFSubset, _super);

    function TTFSubset() {
      return TTFSubset.__super__.constructor.apply(this, arguments);
    }

    TTFSubset.prototype._addGlyph = function(gid) {
      var buffer, component, curOffset, glyf, nextOffset, stream, _i, _len, _ref;
      glyf = this.font.getGlyph(gid)._decode();
      curOffset = this.font.loca.offsets[gid];
      nextOffset = this.font.loca.offsets[gid + 1];
      stream = this.font._getTableStream('glyf');
      stream.pos += curOffset;
      buffer = stream.readBuffer(nextOffset - curOffset);
      if (glyf.numberOfContours < 0) {
        buffer = new Buffer(buffer);
        _ref = glyf.components;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          component = _ref[_i];
          gid = this.includeGlyph(component.glyphID);
          buffer.writeUInt16BE(gid, component.pos);
        }
      }
      this.glyf.push(buffer);
      this.loca.offsets.push(this.offset);
      if (gid < this.font.hmtx.metrics.length) {
        this.hmtx.metrics.push(this.font.hmtx.metrics[gid]);
      } else {
        this.hmtx.metrics.push({
          advanceWidth: this.font.hmtx.metrics[this.font.hmtx.metrics.length - 1].advanceWidth,
          leftSideBearing: this.font.hmtx.leftSideBearings[gid - this.font.hmtx.metrics.length]
        });
      }
      this.offset += buffer.length;
      return this.glyf.length - 1;
    };

    TTFSubset.prototype.encode = function(stream) {
      var head, hhea, i, maxp;
      this.glyf = [];
      this.offset = 0;
      this.loca = {
        offsets: []
      };
      this.hmtx = {
        metrics: [],
        leftSideBearings: []
      };
      i = 0;
      while (i < this.glyphs.length) {
        this._addGlyph(this.glyphs[i++]);
      }
      maxp = _.cloneDeep(this.font.maxp);
      maxp.numGlyphs = this.glyf.length;
      this.loca.offsets.push(this.offset);
      Tables.loca.preEncode.call(this.loca);
      head = _.cloneDeep(this.font.head);
      head.indexToLocFormat = this.loca.version;
      hhea = _.cloneDeep(this.font.hhea);
      hhea.numberOfMetrics = this.hmtx.metrics.length;
      return Directory.encode(stream, {
        tables: {
          head: head,
          hhea: hhea,
          loca: this.loca,
          maxp: maxp,
          'cvt ': this.font['cvt '],
          prep: this.font.prep,
          glyf: this.glyf,
          hmtx: this.hmtx,
          fpgm: this.font.fpgm
        }
      });
    };

    return TTFSubset;

  })(Subset);

  module.exports = TTFSubset;

}).call(this);

});
