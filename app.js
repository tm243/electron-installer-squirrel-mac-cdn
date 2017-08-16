var program = require('commander');
const lib = require('./lib.js');

module.exports = {
  main: function() {

    program.update = undefined;

    program
    .option('-m, --meta-file [meta-name]', 'file to be released')
    .option('-f, --file [file]', 'file to be released')
    .option('-v, --version [version]', 'version of release')
    .option('-r, --remote-path [path]', 'remote path')
    .option('-r, --update [update]', 'update an entry')
    .parse(process.argv);

    lib.writeFile({
        remotePath: program.remotePath
      , file: program.file
      , version: program.version
      , update: program.update
      , path: program.metaFile
    });
  }
}

