const fs = require('fs');

function CopyFile(options) {
    if (!options.filePath || typeof options.filePath !== 'string') {
        process.stderr.write('filePath must be a string');
        process.exit(1);
    }

    this.filePath = options.filePath;
    this.assetName = options.assetName || options.filePath.split('/').pop();
}

CopyFile.prototype.apply = function(compiler) {
    compiler.plugin('emit', (compilation, done) => {
        fs.readFile(this.filePath, (err, file) => {
            if (err) {
                process.stderr.write(`Error reading file ${this.filePath}`);
                process.exit(1);
            }

            if (compilation.assets[this.assetName]) {
                process.stderr.write(`Already an asset named ${this.assetName}`);
                process.exit(1);
            }

            compilation.assets[this.assetName] = {
                source() {
                    return file;
                },
                size() {
                    return file.length;
                }
            }

            done();

        });
    });
}

module.exports = CopyFile;
