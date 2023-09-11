function clean {
    rm -rf bin/*
}

function uglify {
    # npm install uglify-js -g
    uglifyjs popup.js --compress --mangle -o popup.min.js
    uglifyjs service-worker.js --compress --mangle -o service-worker.min.js

}

function copyFiles {
    local dest="bin"
    tar -cvf bo.tar --exclude-from=buildExcludes *
    mkdir -p $dest
    tar -xvf bo.tar -C $dest/
    rm -f bo.tar
}

clean
uglify
copyFiles
