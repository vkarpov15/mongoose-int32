'use strict';

const acquit = require('acquit');
const fs = require('fs');

require('acquit-ignore')();
require('acquit-markdown')();

acquit.output(function(str) {
  return str.replace(/acquit:ignore:end\s+/g, '');
});

const markdown =
  acquit.parse(fs.readFileSync('./test/examples.test.js', 'utf8'));

fs.writeFileSync('./examples.md', markdown);
