'use strict';

const assert = require('assert');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const Int32 = require('../').loadType(mongoose);

describe('API', function() {
  let client;
  let db;

  before(function(done) {
    const uri = 'mongodb://localhost:27017/test';
    mongoose.connect(uri, { useNewUrlParser: true });
    mongodb.MongoClient.connect(uri, { useNewUrlParser: true }, function(error, _client) {
      assert.ifError(error);
      client = _client;
      db = _client.db();
      done();
    });
  });

  beforeEach(function() {
    return mongoose.connection.dropDatabase();
  });

  after(function() {
    client.close();
    mongoose.disconnect();
  });

  /**
   * If you declare a field of type `Int32`, this module will use
   * `Math.round()` to convert it to an integer so MongoDB can store it
   * properly.
   */
  it('casts to int using `Math.round()`', function(done) {
    const schema = new mongoose.Schema({
      test: Int32
    });
    const Test = mongoose.model('Test', schema);

    Test.create({ test: 1.49 }, function(error, doc) {
      assert.equal(doc.test, 1);
      // Int32.INT32_BSON_TYPE=16, see http://bsonspec.org/spec.html
      const query = { test: { $type: Int32.INT32_BSON_TYPE, $eq: 1 } };
      db.collection('tests').findOne(query, function(error, doc) {
        assert.ifError(error);
        assert.ok(doc);
        // acquit:ignore:start
        done();
        // acquit:ignore:end
      });
    });
  });

  /**
   * MongoDB int32's must be between -2147483648 and 2147483647. If the
   * rounded value is outside of this range, that's a CastError.
   */

  it('throws a CastError if outside allowed range', function(done) {
    const Test = mongoose.model('Test');
    const doc = new Test();
    doc.test = 0x7FFFFFFF + 1;
    assert.ok(doc.validateSync() instanceof mongoose.Error);
    assert.equal(doc.validateSync().errors['test'].name, 'CastError');
    assert.equal(doc.validateSync().errors['test'].message,
      'Cast to Int32 failed for value "2147483648" at path "test"');
    // acquit:ignore:start
    done();
    // acquit:ignore:end
  });

  /**
   * If the [`Number` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
   * doesn't recognize the value as a valid number, that's a
   * [CastError](http://mongoosejs.com/docs/api.html#error-js).
   */

  it('throws a CastError if not a number', function(done) {
    const Test = mongoose.model('Test');
    const doc = new Test();
    doc.test = 'NaN';
    assert.ok(doc.validateSync() instanceof mongoose.Error);
    assert.equal(doc.validateSync().errors['test'].name, 'CastError');
    assert.equal(doc.validateSync().errors['test'].message,
      'Cast to Int32 failed for value "NaN" at path "test"');
    // acquit:ignore:start
    done();
    // acquit:ignore:end
  });

  it('works with required validators', function(done) {
    const schema = new mongoose.Schema({
      strips: { type: Int32, required: true }
    });
    const Bacon = mongoose.model('Bacon', schema);
    const doc = new Bacon();
    assert.ok(doc.validateSync() instanceof mongoose.Error);
    assert.equal(doc.validateSync().errors['strips'].name, 'ValidatorError');
    assert.equal(doc.validateSync().errors['strips'].message,
      'Path `strips` is required.');
    // acquit:ignore:start
    done();
    // acquit:ignore:end
  });

  it('works with queries', function(done) {
    const schema = new mongoose.Schema({
      strips: { type: Int32, required: true }
    });
    const Bacon = mongoose.model('Bacon');
    Bacon.create({ strips: 4 }, function(error) {
      assert.ifError(error);
      Bacon.findOne({ strips: { $gt: 2 } }, function(error, bacon) {
        assert.ifError(error);
        assert.equal(bacon.strips, 4);
        // acquit:ignore:start
        done();
        // acquit:ignore:end
      });
    });
  });
});
