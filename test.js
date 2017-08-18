const fs = require('fs');
var assert = require('assert');
var runCli = require('./cli');

let origArgv = undefined;

function addCliArguments(arguments) {
  var res = arguments.split(" ");

  //! restore original args if needed
  if(!origArgv) {
    origArgv = process.argv.slice();
  } else {
    process.argv = origArgv.slice();
  }

  for(i = 0; i < res.length; i++) {
    process.argv.push(res[i]);
  }
}

describe('SquirrelApp', function() {
  it('create RELEASES file if it doesnt exist', function() {
    fs.unlink('RELEASES.test.json');

    addCliArguments("--json-file RELEASES.test.json --app-zip foo.zip --version 0.1.1 --remote-path https://localhost/");
    runCli();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.releases[0].version, '0.1.1');
  });

  it('add a new release', function() {
    addCliArguments("--json-file RELEASES.test.json --app-zip foo.zip --version 0.1.4 --remote-path https://localhost/");
    runCli();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.currentRelease, '0.1.4');
    assert.equal(fileContent.releases[1].version, '0.1.4');
    assert.equal(fileContent.releases[1].updateTo.url, 'https://localhost/foo.zip');
  });

  it('update an existing release', function() {
    addCliArguments("--json-file RELEASES.test.json --app-zip bar.zip --version 0.1.4 --remote-path https://localhost/ --update");
    runCli();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.releases[1].version, '0.1.4');
    assert.equal(fileContent.releases[1].updateTo.url, 'https://localhost/bar.zip');
  });

  it('add another release', function() {
    addCliArguments("--json-file RELEASES.test.json --app-zip foo2.zip --version 0.1.5 --remote-path https://localhost/");
    runCli();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.currentRelease, '0.1.5');
    assert.equal(fileContent.releases[2].version, '0.1.5');
    assert.equal(fileContent.releases[2].updateTo.url, 'https://localhost/foo2.zip');
  });

  it('and another release', function() {
    addCliArguments("--json-file RELEASES.test.json --app-zip foo3.zip --version 0.1.6 --remote-path https://localhost/");
    runCli();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.currentRelease, '0.1.6');
    assert.equal(fileContent.releases[3].version, '0.1.6');
    assert.equal(fileContent.releases[3].updateTo.url, 'https://localhost/foo3.zip');
  });

  it('and notes', function() {
    addCliArguments("--json-file RELEASES.test.json --app-zip foo3.zip --version 0.1.7 --remote-path https://localhost/ --notes I-am-a-note ");
    runCli();

    var data = fs.readFileSync('RELEASES.test.json', 'utf8');
    var fileContent = JSON.parse(data);

    assert.equal(fileContent.currentRelease, '0.1.7');
    assert.equal(fileContent.releases[4].version, '0.1.7');
    assert.equal(fileContent.releases[4].updateTo.notes, 'I-am-a-note');
  });

});
