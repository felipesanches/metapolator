/*
 * Don't edit this file by hand!
 * This file was generated from a npm-package using gulp. 
 * For more information see gulpfile.js in the project root
 */
define(function (require, exports, module) {// Generated by CoffeeScript 1.8.0
(function() {
  var CmapProcessor;

  CmapProcessor = (function() {
    function CmapProcessor(cmapTable) {
      var cmap, _i, _j, _len, _len1, _ref, _ref1, _ref2;
      this._characterSet = null;
      _ref = cmapTable.tables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cmap = _ref[_i];
        if ((cmap.platformID === 0 && ((_ref1 = cmap.encodingID) === 4 || _ref1 === 6)) || (cmap.platformID === 3 && cmap.encodingID === 10)) {
          this.cmap = cmap.table;
          return;
        }
      }
      _ref2 = cmapTable.tables;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        cmap = _ref2[_j];
        if (cmap.platformID === 0 || (cmap.platformID === 3 && cmap.encodingID === 1)) {
          this.cmap = cmap.table;
          return;
        }
      }
      throw new Error("Could not find a unicode cmap");
    }

    CmapProcessor.prototype.lookup = function(codepoint) {
      var cmap, gid, group, index, max, mid, min, rangeOffset;
      cmap = this.cmap;
      switch (cmap.version) {
        case 0:
          return cmap.codeMap[codepoint] || 0;
        case 4:
          min = 0;
          max = cmap.segCount - 1;
          while (min <= max) {
            mid = (min + max) >> 1;
            if (codepoint < cmap.startCode[mid]) {
              max = mid - 1;
            } else if (codepoint > cmap.endCode[mid]) {
              min = mid + 1;
            } else {
              rangeOffset = cmap.idRangeOffset[mid];
              if (rangeOffset === 0) {
                gid = codepoint + cmap.idDelta[mid];
              } else {
                index = rangeOffset / 2 + (codepoint - cmap.startCode[mid]) - (cmap.segCount - mid);
                gid = cmap.glyphIndexArray[index] || 0;
                if (gid !== 0) {
                  gid += cmap.idDelta[mid];
                }
              }
              return gid & 0xffff;
            }
          }
          return 0;
        case 8:
          throw new Error('TODO: cmap format 8');
          break;
        case 6:
        case 10:
          return cmap.glyphIndices[codepoint - cmap.firstCode] || 0;
        case 12:
        case 13:
          min = 0;
          max = cmap.nGroups - 1;
          while (min <= max) {
            mid = (min + max) >> 1;
            group = cmap.groups[mid];
            if (codepoint < group.startCharCode) {
              max = mid - 1;
            } else if (codepoint > group.endCharCode) {
              min = mid + 1;
            } else {
              if (cmap.version === 12) {
                return group.glyphID + (codepoint - group.startCharCode);
              } else {
                return group.glyphID;
              }
            }
          }
          return 0;
        case 14:
          throw new Error('TODO: cmap format 14');
          break;
        default:
          throw new Error('Unknown cmap format ' + cmap.version);
      }
    };

    CmapProcessor.prototype.getCharacterSet = function() {
      var cmap, group, i, res, start, tail, _i, _j, _k, _l, _len, _len1, _m, _n, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _results, _results1, _results2, _results3;
      if (this._characterSet) {
        return this._characterSet;
      }
      cmap = this.cmap;
      switch (cmap.version) {
        case 0:
          this._characterSet = (function() {
            _results = [];
            for (var _i = 0, _ref = cmap.codeMap.length; 0 <= _ref ? _i < _ref : _i > _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this);
          break;
        case 4:
          res = [];
          _ref1 = cmap.endCode;
          for (i = _j = 0, _len = _ref1.length; _j < _len; i = ++_j) {
            tail = _ref1[i];
            start = cmap.startCode[i];
            res.push.apply(res, (function() {
              _results1 = [];
              for (var _k = start; start <= tail ? _k <= tail : _k >= tail; start <= tail ? _k++ : _k--){ _results1.push(_k); }
              return _results1;
            }).apply(this));
          }
          this._characterSet = res;
          break;
        case 8:
          throw new Error('TODO: cmap format 8');
          break;
        case 6:
        case 10:
          this._characterSet = (function() {
            _results2 = [];
            for (var _l = _ref2 = cmap.firstCode, _ref3 = cmap.firstCode + cmap.glyphIndices.length; _ref2 <= _ref3 ? _l < _ref3 : _l > _ref3; _ref2 <= _ref3 ? _l++ : _l--){ _results2.push(_l); }
            return _results2;
          }).apply(this);
          break;
        case 12:
        case 13:
          res = [];
          _ref4 = cmap.groups;
          for (_m = 0, _len1 = _ref4.length; _m < _len1; _m++) {
            group = _ref4[_m];
            res.push.apply(res, (function() {
              _results3 = [];
              for (var _n = _ref5 = group.startCharCode, _ref6 = group.endCharCode; _ref5 <= _ref6 ? _n <= _ref6 : _n >= _ref6; _ref5 <= _ref6 ? _n++ : _n--){ _results3.push(_n); }
              return _results3;
            }).apply(this));
          }
          this._characterSet = res;
          break;
        case 14:
          throw new Error('TODO: cmap format 14');
          break;
        default:
          throw new Error('Unknown cmap format ' + cmap.version);
      }
      return this._characterSet;
    };

    return CmapProcessor;

  })();

  module.exports = CmapProcessor;

}).call(this);

});
