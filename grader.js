#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
   */

   var fs = require('fs');
   var rest = require('restler');
   var program = require('commander');
   var cheerio = require('cheerio');
   var HTMLFILE_DEFAULT = "index.html";
   var CHECKSFILE_DEFAULT = "checks.json";
   var URL_DEFAULT = "http://radiant-hollows-1551.herokuapp.com"

   // halts if the provided filename doesn't exist
   function assertFileExists(filename) {
    if (!fs.existsSync(filename)) {
      console.log("%s does not exist. Exiting.", filename);
      process.exit(1);
    }
    return filename;
  }

// loads checks from a file
function loadChecks(checksfile) {
  return JSON.parse(fs.readFileSync(checksfile)).sort();
}

// checks html
function checkHtml(html, checks) {
  $ = cheerio.load(html);
  var out = {};
  for(var ii in checks) {
    var present = $(checks[ii]).length > 0;
    out[checks[ii]] = present;
  }
  return out;
}

// loads html from a file and checks it
// for exports only
function checkHtmlFile(filename, checks) {
  return checkHtml(fs.readFileSync(filename), checks);
}

// downloads html from the internet
// callback is called with two arguments: err, html
// where err is null if there is no error
function download(url, callback) {
  var resp = rest.get(url);
  resp.on('complete', function(result) {
    if (result instanceof Error) {
            // callback(result);
            sys.puts('Error: ' + result.message);
            this.retry(5000); // try again after 5 sec
            return;
          }
          callback(null, result);
        });
}

if (require.main == module) {
  program
  .option('-c, --checks <check_file>', 'Path to checks.json', assertFileExists, CHECKSFILE_DEFAULT)
  .option('-f, --file <html_file>', 'Path to index.html', assertFileExists, HTMLFILE_DEFAULT)
        .option('-u, --url  <url>', 'Path to downloaded url') ///////////////
        .parse(process.argv); 

    // this function loads checks & checks html
    function check(err, html) {
      if (err) {
        console.log('Error getting html: ' + err);
        process.exit(1);
      }
      var checks = loadChecks(program.checks);
      var checkJson = checkHtml(html, checks);
      var outJson = JSON.stringify(checkJson, null, 4);
      console.log(outJson);
    }

    if (program.url) {
        // download the provided url and then check the html
        download(program.url, check);
      } else if (program.file) {
        // load html from a file and then check it
        fs.readFile(program.file, check);
      }
    } else {
    exports.loadChecks = loadChecks; // for loading checks
    exports.checkHtmlFile = checkHtmlFile; // for checking a file
  }