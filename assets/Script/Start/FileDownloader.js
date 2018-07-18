var FileDownloader = {

    download(url, callback) {
        // var xhr = new XMLHttpRequest();
        var xhr = cc.loader.getXMLHttpRequest()

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.response);
                } else {
                    callback(null);
                }
            }
        };

        xhr.open("GET", url, true);
        xhr.responseType = 'arraybuffer';
        xhr.send();
    },

    saveFile(data, dirPath, fileName) {
        //format dirPath
        if (dirPath.charAt(dirPath.length - 1) != '/') {
            dirPath += '/';
        }
        //check dirPath
        if (!jsb.fileUtils.isDirectoryExist(dirPath)) {
            jsb.fileUtils.createDirectory(dirPath);
        }
        //check file
        // if (jsb.fileUtils.isFileExist(dirPath + fileName)) { }

        if (typeof data !== 'undefined') {
            let filePath = dirPath + fileName;
            if (jsb.fileUtils.writeDataToFile(new Uint8Array(data), filePath)) {
                return filePath;
            }
        }
        return null;
    }
};

module.exports = FileDownloader;