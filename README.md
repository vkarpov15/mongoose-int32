# mongoose-int32

Mongoose type for storing MongoDB int32 [(bson type 16)](http://bsonspec.org/spec.html)

[![Build Status](https://travis-ci.org/vkarpov15/mongoose-int32.svg?branch=master)](https://travis-ci.org/vkarpov15/mongoose-int32)

# Usage

Requires `mongoose >= 4.4.0`. Do not use with mongoose 3.x.

```javascript
const mongoose = require("mongoose");
const Int32 = require("mongoose-int32").loadType(mongoose);
```
