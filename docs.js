'use strict';

const acquit = require('acquit');
const fs = require('fs');

require('acquit-ignore')();
require('acquit-markdown')();

const markdown =
  acquit.parse(fs.readFileSync('./test/examples.test.js', 'utf8'));

fs.writeFileSync('./examples.md', markdown);
