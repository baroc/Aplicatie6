(function () {
    ons.ready(function () {
        console.log("Onsen UI is ready!");
        window.requestFileSystem(window.TEMPORARY, 1024, onSuccessFs, onError);
    });

    function onSuccessFs(fs) {
        console.log('file system open: ' + fs.name);
        // Make sure you add the domain name to the Content-Security-Policy <meta> element.
        // In config.xml am adaugat <allow-navigation href="http://*/*" />
        var uri = encodeURI("http://aplimob.net/categorii.json");
        // Parameters passed to getFile create a new file or return the file if it already exists.
        fs.root.getFile('categ.json', {create: true, exclusive: false}, function (fileEntry) {
            download(fileEntry, uri);
        }, onError);
    }

    function onError() {
        console.log('Pățăști!');
    }

    function download(fileEntry, uri) {

        var fileTransfer = new FileTransfer();
        var fileURL = fileEntry.toURL();

        fileTransfer.download(
           uri,
           fileURL,
           function (entry) {
               //  console.log("Successful download...");
               //  console.log("download complete: " + entry.toURL());
               readFile(entry);
           },
           onErrorTransfer);
    }

    function onErrorTransfer(error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("upload error code" + error.code);
    }

    var categorii = null;

    function readFile(fileEntry) {
        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function () {
                console.log("Successful file read: " + this.result);
                categorii = JSON.parse(this.result);
                //  Afisez categoriile
                for (var i = 0; i < categorii.length; i++) {
                    for (var k in categorii[i]) {
                        console.log(k + " " + categorii[i][k]);
                    }
                }
            };
            reader.readAsText(file);
        }, onErrorReadFile);
    }

    function onErrorReadFile() {
        console.log('N-am citit');
    }

    window.fn = {};
    window.fn.open = function () {
        var menu = document.getElementById('menu');
        menu.open();
    };
    window.fn.load = function (page) {
        var content = document.getElementById('content');
        var menu = document.getElementById('menu');
        content
           .load(page)
           .then(menu.close.bind(menu));
    };
})();