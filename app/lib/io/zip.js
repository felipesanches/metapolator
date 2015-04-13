define([
    'jszip'
  , 'io/readDirRecursive'
], function(
    JSZip
  , readDirRecursive
) {
    "use strict";

    var unpack = function(zipData, io, targetPath){
        var zip = new JSZip();
        zip.load(zipData, {base64: true});
        var files = zip.files;
        var i;

        for (i in files){
            var file = files[i];
            var absolute_path = [targetPath, file.name].join(targetPath.split()[-1]=="/" ? "" : "/");
            if (!file.dir){
                io.writeFile(false, absolute_path, file.asBinary());
            }
        }

/*
        function unpackZipRecursive(entry){
            var files = entry.folder(//);
            var i;

            for (i in files){
                var file = files[i];
                var absolute_path = [targetPath, file.name].join(targetPath.split()[-1]=="/" ? "" : "/");
                if (file.dir){
                    readZipRecursive(file);
                } else {
                    io.writeFile(false, absolute_path, file.asBinary());
                }
            }
        }

        unpackZipRecursive(zip);
*/
    };

    var encode = function(io, sourcePath){
        var zip = new JSZip();
        var files = readDirRecursive(false, io, sourcePath);
        var i;

        for (i in files){
            var file = files[i];
            var relative_path = file.split(sourcePath)[1];
            var data = io.readFile(false, file);
            zip.file(relative_path, data, {binary:true});
        }

        var content = zip.generate({type:"base64"});
        return content;
    };

    return {
        unpack: unpack,
        encode: encode
    };
});
