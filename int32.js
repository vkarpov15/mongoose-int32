'use strict';

const mongoose = require('mongoose');

const INT32_MAX = 0x7FFFFFFF;
const INT32_MIN = -0x80000000;

class Int32 extends mongoose.SchemaType {
  constructor(key, options) {
    super(key, options, 'Int32');
  }

  /**
   * Cast the given value to something that MongoDB will store as int32
   *
   * @param {any} val
   * @return {Number}
   */

  cast(val) {
    var _val = Number(val);
    if (isNaN(_val)) {
      throw new mongoose.SchemaType.CastError('Int32',
        val + ' is not a number');
    }
    _val = Math.round(_val);
    if (_val < INT32_MIN || _val > INT32_MAX) {
      throw new mongoose.SchemaType.CastError('Int32', val +
        ' is outside of the range of valid BSON int32s: ' + INT32_MAX + ' - ' +
        INT32_MIN);
    }
    return _val;
  }
}

Int32.prototype.$conditionalHandlers =
  mongoose.Schema.Types.Number.prototype.$conditionalHandlers;

Int32.INT32_BSON_TYPE = 16;
Int32.INT32_MAX = INT32_MAX;
Int32.INT32_MIN = INT32_MIN;

Int32.instance = 'Int32';
mongoose.Schema.Types.Int32 = Int32;
module.exports = Int32;
