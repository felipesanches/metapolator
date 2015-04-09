define([
    'ufojs/errors'
  , 'ufojs/tools/io/_base'
  , 'obtain/obtain'
  , 'path'
  , 'jszip'
], function(
    errors
  , Parent
  , obtain
  , path
  , jszip
) {
    "use strict";

    /*global process: true*/
    /*global setTimeout: true*/

    var NotImplementedError = errors.NotImplemented
      , IOError = errors.IO
      , IONotDirError = errors.IONotDir // node error: ENOTDIR
      , IOIsDirError = errors.IOIsDir // node error: EISDIR
      , IONoEntryError = errors.IONoEntry // node error: ENOENT
      , IOEntryExistsError = errors.IOEntryExists // node error: EEXIST
      , IONotEmptyError = errors.IONotEmpty // ENOTEMPTY
      , assert = errors.assert
      ;

    function ZipIO() {
        Parent.call(this);
        this._zip = new jszip.JSZip();
    }

    var _p = ZipIO.prototype = Object.create(Parent.prototype);

    _p._getMtime = function(path, content, append) {
        throw new NotImplementedError('getMtime');
    }

    _p._readDir = function(path, content, append) {
        throw new NotImplementedError('readDir');
    }

    _p._readFile = function(path, content, append) {
        throw new NotImplementedError('readFile');
    }

    _p._writeFile = function(path, content, append) {
        data = this._zip.file(path.normalPath);
        if(append)
            data += content;
        else
            data = content;
        this._zip.file(path.normalPath, data, {createFolders:true, binary:true});
    };

    _p._unlink = function(path) {
        throw new NotImplementedError('unlink');
    };

    _p._pathExists = function(path) {
        return !!this._zip.file(path.normalPath);
    };

    _p._mkDir = function(path) {
        this._zip.folder(path.directory);
    };

    function _obtainRequestFactory(extraAPI, request) {
        var api = ['pathString'];
        if(extraAPI)
            Array.prototype.push.apply(api,
                        extraAPI instanceof Array ? extraAPI : [extraAPI]);
        return obtain.factory(
            {
                request: request
            }
          , {}
          , api
          , function(obtain){ return obtain('request'); }
        );
    }

    _p.readFile = _obtainRequestFactory(undefined, ['path', _p._readFile]);
    _p.getMtime = _obtainRequestFactory(undefined, ['path', _p._getMtime]);
    _p.readDir = _obtainRequestFactory(undefined, ['path', _p._readDir]);
    _p.pathExists = _obtainRequestFactory(undefined, ['path', _p._pathExists]);

    _p.writeFile = _obtainRequestFactory('data', ['path', 'data', false, _p._writeFile]);
    _p.appendFile = _obtainRequestFactory('data', ['path', 'data', true, _p._writeFile]);
    _p.unlink = _obtainRequestFactory(undefined, ['path', _p._unlink]);
    // `readBytes` is not implemented
    _p.mkDir = _obtainRequestFactory(undefined, ['path', _p._mkDir]);
    _p.ensureDir = _obtainRequestFactory(undefined, ['path', function(path) {
        throw new NotImplementedError('ensureDir');
    }]);

    return ZipIO;
});
