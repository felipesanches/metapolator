/*
 * Don't edit this file by hand!
 * This file was generated from a npm-package using gulp. 
 * For more information see gulpfile.js in the project root
 */
define(function (require, exports, module) {// Generated by CoffeeScript 1.8.0
(function() {
  var TTFFont, TTFGlyph, WOFF2Font, WOFF2Glyph, brotli, r,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  r = require('restructure');

  brotli = require('brotli');

  TTFFont = require('./TTFFont');

  TTFGlyph = require('./glyph/TTFGlyph');

  WOFF2Glyph = require('./glyph/WOFF2Glyph');

  WOFF2Font = (function(_super) {
    var GlyfTable, LOWEST_U_CODE, ONE_MORE_BYTE_CODE1, ONE_MORE_BYTE_CODE2, Point, Substream, WOFF2Header, WORD_CODE, decodeTriplet, knownTags, read255UInt16, readBase128, withSign;

    __extends(WOFF2Font, _super);

    function WOFF2Font() {
      return WOFF2Font.__super__.constructor.apply(this, arguments);
    }

    WOFF2Header = new r.Struct({
      tag: new r.String(4),
      flavor: r.uint32,
      length: r.uint32,
      numTables: r.uint16,
      reserved: new r.Reserved(r.uint16),
      totalSfntSize: r.uint32,
      totalCompressedSize: r.uint32,
      majorVersion: r.uint16,
      minorVersion: r.uint16,
      metaOffset: r.uint32,
      metaLength: r.uint32,
      metaOrigLength: r.uint32,
      privOffset: r.uint32,
      privLength: r.uint32
    });

    knownTags = ['cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill'];

    readBase128 = function(stream) {
      var code, i, result, _i;
      result = 0;
      for (i = _i = 0; _i < 5; i = ++_i) {
        code = stream.readUInt8();
        if (result & 0xe0000000) {
          throw new Error('Overflow');
        }
        result = (result << 7) | (code & 0x7f);
        if ((code & 0x80) === 0) {
          return result;
        }
      }
      throw new Error('Bad base 128 number');
    };

    WOFF2Font.prototype._decodeDirectory = function() {
      var entry, flags, index, _i, _ref, _ref1;
      this.directory = WOFF2Header.decode(this.stream);
      this.directory.tables = {};
      for (index = _i = 0, _ref = this.directory.numTables; _i < _ref; index = _i += 1) {
        entry = {};
        flags = entry.flags = this.stream.readUInt8();
        if ((flags & 0x3f) === 0x3f) {
          entry.tag = this.stream.readString(4);
        } else {
          entry.tag = knownTags[flags & 0x3f];
          if (!entry.tag) {
            throw new Error('Bad Tag: ' + (flags & 0x3f));
          }
        }
        entry.length = readBase128(this.stream);
        if ((_ref1 = entry.tag) === 'glyf' || _ref1 === 'loca') {
          entry.transformLength = readBase128(this.stream);
        }
        this.directory.tables[entry.tag] = entry;
      }
      return this._dataPos = this.stream.pos;
    };

    WOFF2Font.prototype._decompress = function() {
      var buffer, decompressed, decompressedSize, entry, tag, _ref;
      if (!this._decompressed) {
        this.stream.pos = this._dataPos;
        buffer = this.stream.readBuffer(this.directory.totalCompressedSize);
        decompressedSize = 0;
        _ref = this.directory.tables;
        for (tag in _ref) {
          entry = _ref[tag];
          entry.offset = decompressedSize;
          decompressedSize += entry.transformLength || entry.length;
        }
        decompressed = brotli.decompress(buffer, decompressedSize);
        if (!decompressed) {
          throw new Error('Error decoding compressed data in WOFF2');
        }
        this.stream = new r.DecodeStream(new Buffer(decompressed));
        return this._decompressed = true;
      }
    };

    WOFF2Font.prototype._decodeTable = function(table) {
      this._decompress();
      this.stream.pos = table.offset;
      return WOFF2Font.__super__._decodeTable.apply(this, arguments);
    };

    WOFF2Font.prototype._getBaseGlyph = function(glyph, characters) {
      if (characters == null) {
        characters = [];
      }
      if (!this._glyphs[glyph]) {
        if (this.directory.tables.glyf != null) {
          if (!this._transformedGlyphs) {
            this._transformGlyfTable();
          }
          return this._glyphs[glyph] = new WOFF2Glyph(glyph, characters, this);
        } else {
          return WOFF2Font.__super__._getBaseGlyph.apply(this, arguments);
        }
      }
    };

    Substream = (function() {
      function Substream(length) {
        this.length = length;
        this._buf = new r.Buffer(length);
      }

      Substream.prototype.decode = function(stream, parent) {
        return new r.DecodeStream(this._buf.decode(stream, parent));
      };

      return Substream;

    })();

    GlyfTable = new r.Struct({
      version: r.uint32,
      numGlyphs: r.uint16,
      indexFormat: r.uint16,
      nContourStreamSize: r.uint32,
      nPointsStreamSize: r.uint32,
      flagStreamSize: r.uint32,
      glyphStreamSize: r.uint32,
      compositeStreamSize: r.uint32,
      bboxStreamSize: r.uint32,
      instructionStreamSize: r.uint32,
      nContours: new Substream('nContourStreamSize'),
      nPoints: new Substream('nPointsStreamSize'),
      flags: new Substream('flagStreamSize'),
      glyphs: new Substream('glyphStreamSize'),
      composites: new Substream('compositeStreamSize'),
      bboxes: new Substream('bboxStreamSize'),
      instructions: new Substream('instructionStreamSize')
    });

    WOFF2Font.prototype._transformGlyfTable = function() {
      var glyph, glyphs, haveInstructions, i, index, instructionSize, nContours, nPoints, table, totalPoints, _i, _j, _k, _ref;
      this._decompress();
      this.stream.pos = this.directory.tables.glyf.offset;
      table = GlyfTable.decode(this.stream);
      glyphs = [];
      for (index = _i = 0, _ref = table.numGlyphs; _i < _ref; index = _i += 1) {
        glyph = {};
        nContours = table.nContours.readInt16BE();
        glyph.numberOfContours = nContours;
        if (nContours > 0) {
          nPoints = [];
          totalPoints = 0;
          for (i = _j = 0; _j < nContours; i = _j += 1) {
            r = read255UInt16(table.nPoints);
            nPoints.push(r);
            totalPoints += r;
          }
          glyph.points = decodeTriplet(table.flags, table.glyphs, totalPoints);
          for (i = _k = 0; _k < nContours; i = _k += 1) {
            glyph.points[nPoints[i] - 1].endContour = true;
          }
          instructionSize = read255UInt16(table.glyphs);
        } else if (nContours < 0) {
          haveInstructions = TTFGlyph.prototype._decodeComposite(glyph, table.composites);
          if (haveInstructions) {
            instructionSize = read255UInt16(table.glyphs);
          }
        }
        glyphs.push(glyph);
      }
      return this._transformedGlyphs = glyphs;
    };

    WORD_CODE = 253;

    ONE_MORE_BYTE_CODE2 = 254;

    ONE_MORE_BYTE_CODE1 = 255;

    LOWEST_U_CODE = 253;

    read255UInt16 = function(stream) {
      var code;
      code = stream.readUInt8();
      if (code === WORD_CODE) {
        return stream.readUInt16BE();
      }
      if (code === ONE_MORE_BYTE_CODE1) {
        return stream.readUInt8() + LOWEST_U_CODE;
      }
      if (code === ONE_MORE_BYTE_CODE2) {
        return stream.readUInt8() + LOWEST_U_CODE * 2;
      }
      return code;
    };

    Point = (function() {
      function Point(x, y, onCurve) {
        this.x = x;
        this.y = y;
        this.onCurve = onCurve;
        this.endContour = false;
      }

      return Point;

    })();

    withSign = function(flag, baseval) {
      if (flag & 1) {
        return baseval;
      } else {
        return -baseval;
      }
    };

    decodeTriplet = function(flags, glyphs, nPoints) {
      var b0, b1, b2, dx, dy, flag, i, onCurve, res, x, y, _i;
      x = y = 0;
      res = [];
      for (i = _i = 0; _i < nPoints; i = _i += 1) {
        flag = flags.readUInt8();
        onCurve = !(flag >> 7);
        flag &= 0x7f;
        if (flag < 10) {
          dx = 0;
          dy = withSign(flag, ((flag & 14) << 7) + glyphs.readUInt8());
        } else if (flag < 20) {
          dx = withSign(flag, (((flag - 10) & 14) << 7) + glyphs.readUInt8());
          dy = 0;
        } else if (flag < 84) {
          b0 = flag - 20;
          b1 = glyphs.readUInt8();
          dx = withSign(flag, 1 + (b0 & 0x30) + (b1 >> 4));
          dy = withSign(flag >> 1, 1 + ((b0 & 0x0c) << 2) + (b1 & 0x0f));
        } else if (flag < 120) {
          b0 = flag - 84;
          dx = withSign(flag, 1 + ((b0 / 12) << 8) + glyphs.readUInt8());
          dy = withSign(flag >> 1, 1 + (((b0 % 12) >> 2) << 8) + glyphs.readUInt8());
        } else if (flag < 124) {
          b1 = glyphs.readUInt8();
          b2 = glyphs.readUInt8();
          dx = withSign(flag, (b1 << 4) + (b2 >> 4));
          dy = withSign(flag >> 1, ((b2 & 0x0f) << 8) + glyphs.readUInt8());
        } else {
          dx = withSign(flag, glyphs.readUInt16BE());
          dy = withSign(flag >> 1, glyphs.readUInt16BE());
        }
        x += dx;
        y += dy;
        res.push(new Point(x, y, onCurve));
      }
      return res;
    };

    return WOFF2Font;

  })(TTFFont);

  module.exports = WOFF2Font;

}).call(this);

});
