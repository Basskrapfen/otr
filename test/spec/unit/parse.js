/*global describe before it beforeEach */
var assert = require('assert')
  , CryptoJS = require('../../../vendor/crypto.js')
  , CONST = require('../../../lib/const.js')
  , HLP = require('../../../lib/helpers.js')
  , Parse = require('../../../lib/parse.js')
  , OTR = function () {}  // just a constructor

describe('Parse', function () {

  var otr
  beforeEach(function () {
    otr = new OTR()
  })

  it('should detect message fragments', function () {
    assert.equal('hi', (Parse.parseMsg(otr, 'hi')).msg, 'Hi.')
    assert.equal('hi?OTR', (Parse.parseMsg(otr, 'hi?OTR')).msg, 'OTR!')

    var MSGFRAG1 = '?OTR,1,3,?OTR:AAIKAAAAAQAAAAEAAADAVf3Ei72ZgFeKqWvLMnuVPVCwxktsOZ1QdjeLp6jn62mCVtlY9nS6sRkecpjuLYHRxyTdRu2iEVtSsjZqK55ovZ35SfkOPHeFYa9BIuxWi9djHMVKQ8KOVGAVLibjZ6P8LreDSKtWDv9YQjIEnkwFVGCPfpBq2SX4VTQfJAQXHggR8izKxPvluXUdG9rIPh4cac98++VLdIuFMiEXjUIoTX2rEzunaCLMy0VIfowlRsgsKGrwhCCv7hBWyglbzwz+AAAAAAAAAAQAAAF2SOr,'
    var MSGFRAG2 = '?OTR,2,3,JvPUerB9mtf4bqQDFthfoz/XepysnYuReHHEXKe+BFkaEoMNGiBl4TCLZx72DvmZwKCewWRH1+W66ggrXKw2VdVl+vLsmzxNyWChGLfBTL5/3SUF09BfmCEl03Ckk7htAgyAQcBf90RJznZndv7HwVAi3syupi0sQDdOKNPyObR5FRtqyqudttWmSdmGCGFcZ/fZqxQNsHB8QuYaBiGL7CDusES+wwfn8Q7BGtoJzOPDDx6KyIyox/flPx2DZDJIZrMz9b0V70a9kqKLo/wcGhvHO6coCyMxenBAacLJ1DiI,'
    var MSGFRAG3 = '?OTR,3,3,NLKoYOoJTM7zcxsGnvCxaDZCvsmjx3j8Yc5r3i3ylllCQH2/lpr/xCvXFarGtG7+wts+UqstS9SThLBQ9Ojq4oPsX7HBHKvq19XU3/ChIgWMy+bczc5gpkC/eLAIGfJ0D5DJsl68vMXSmCoFK0HTwzzNa7lnZK4IutYPBNBCv0pWORQqDpskEz96YOGyB8+gtpFgCrkuV1bSB9SRVmEBfDtKPQFhKowAAAAA=.,'
    var MSGFRAG = '?OTR:AAIKAAAAAQAAAAEAAADAVf3Ei72ZgFeKqWvLMnuVPVCwxktsOZ1QdjeLp6jn62mCVtlY9nS6sRkecpjuLYHRxyTdRu2iEVtSsjZqK55ovZ35SfkOPHeFYa9BIuxWi9djHMVKQ8KOVGAVLibjZ6P8LreDSKtWDv9YQjIEnkwFVGCPfpBq2SX4VTQfJAQXHggR8izKxPvluXUdG9rIPh4cac98++VLdIuFMiEXjUIoTX2rEzunaCLMy0VIfowlRsgsKGrwhCCv7hBWyglbzwz+AAAAAAAAAAQAAAF2SOrJvPUerB9mtf4bqQDFthfoz/XepysnYuReHHEXKe+BFkaEoMNGiBl4TCLZx72DvmZwKCewWRH1+W66ggrXKw2VdVl+vLsmzxNyWChGLfBTL5/3SUF09BfmCEl03Ckk7htAgyAQcBf90RJznZndv7HwVAi3syupi0sQDdOKNPyObR5FRtqyqudttWmSdmGCGFcZ/fZqxQNsHB8QuYaBiGL7CDusES+wwfn8Q7BGtoJzOPDDx6KyIyox/flPx2DZDJIZrMz9b0V70a9kqKLo/wcGhvHO6coCyMxenBAacLJ1DiINLKoYOoJTM7zcxsGnvCxaDZCvsmjx3j8Yc5r3i3ylllCQH2/lpr/xCvXFarGtG7+wts+UqstS9SThLBQ9Ojq4oPsX7HBHKvq19XU3/ChIgWMy+bczc5gpkC/eLAIGfJ0D5DJsl68vMXSmCoFK0HTwzzNa7lnZK4IutYPBNBCv0pWORQqDpskEz96YOGyB8+gtpFgCrkuV1bSB9SRVmEBfDtKPQFhKowAAAAA=.'

    assert.equal(null, Parse.parseMsg(otr, MSGFRAG1), 'Message fragment 1.')
    assert.equal(null, Parse.parseMsg(otr, MSGFRAG2), 'Message fragment 2.')
    var three = Parse.parseMsg(otr, MSGFRAG3)
    assert.equal(three.msg[0], Parse.parseMsg(otr, MSGFRAG).msg[0], 'Message fragment.')
  })

  it('should parse otr "Version 1 Only" query message', function () {
    var msg = Parse.parseMsg(otr, '?OTR?')
    assert.equal(1, msg.ver.length, 'version 1')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_1), 'version 1')
  })

  it('should parse otr "Version 2 Only" query message', function () {
    var msg = Parse.parseMsg(otr, '?OTRv2?')
    assert.equal(1, msg.ver.length, 'version 2')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_2), 'version 2')
  })

  it('should parse otr "Version 1 & 2" query message', function () {
    var msg = Parse.parseMsg(otr, '?OTR?v2?')
    assert.equal(2, msg.ver.length, 'version 1 & 2')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_1), 'version 1 & 2')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_2), 'version 1 & 2')
  })

  it('should parse otr "Version 3 & 2" query message, order should not matter', function () {
    var msg = Parse.parseMsg(otr, '?OTRv32?')
    assert.equal(2, msg.ver.length, 'version 3 & 2')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_3), 'version 3 & 2')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_2), 'version 3 & 2')
  })

  it('should parse otr "Version 2, 4, x only" query message', function () {
    var msg = Parse.parseMsg(otr, '?OTRv24x?')
    assert.equal(1, msg.ver.length, 'version 2, 4, x')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_2), 'version 2, 4, x')
  })

  it('should parse otr "Version 2, 4, x" query message', function () {
    var msg = Parse.parseMsg(otr, '?OTR?v24x?')
    assert.equal(2, msg.ver.length, 'version 1, 2, 4, x')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_1), 'version 1, 2, 4, x')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_2), 'version 1, 2, 4, x')
  })

  it('should parse otr "Version 1 Only" query message 2', function () {
    var msg = Parse.parseMsg(otr, '?OTR?v?')
    assert.equal(1, msg.ver.length, 'version 1 ?')
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_1), 'version 1 ?')
  })

  it('should parse otr bizarre claim query message', function () {
    var msg = Parse.parseMsg(otr, '?OTRv?')
    assert.equal(0, msg.ver.length, 'version bizarre')
  })

  it('should parse otr error message', function () {
    otr.error = function (msg) {
      assert.equal('This is an error.', msg, 'Err.')
    }
    Parse.parseMsg(otr, '?OTR Error:This is an error.')
  })

  it('should encode properly', function () {
    var enc = 'QgEDAwEIBgQCAAAAA2ZvbwAAAADerb7vAAAADWVuY29kZWRfZHVtbXl0aGlzIGlzIGEgZHVtbXkgbWFjAAAAAAA='
    var dec = '\x42' + '\x01\x03\x03\x01' + '\x08\x06\x04\x02' + HLP.packData('foo') +
              '\x00\x00\x00\x00\xde\xad\xbe\xef' + HLP.packData('encoded_dummy') + 
              'this is a dummy mac\x00' + '\x00\x00\x00\x00'
    dec = CryptoJS.enc.Latin1.parse(dec)
    assert.equal(enc, dec.toString(CryptoJS.enc.Base64), 'Base64')
  })

  it('should parse msgs', function () {
    otr.ALLOW_V2 = true
    var msg = Parse.parseMsg(otr, '?OTR:AAIKAAAAA2Zvbw==.')
    assert.equal('foo', msg.msg.substring(4), 'Foo')

    msg = Parse.parseMsg(otr, '?OTR:AAIDQgEDAwEIBgQCAAAAA2ZvbwAAAADerb7vAAAADWVuY29kZWRfZHVtbXl0aGlzIGlzIGEgZHVtbXkgbWFjAAAAAAA=.')
    var types = ['BYTE', 'INT', 'INT', 'MPI', 'CTR', 'DATA', 'MAC', 'DATA']
    msg = HLP.splitype(types, msg.msg)
    assert.equal('\x42', msg[0], 'flag')
    assert.equal('\x01\x03\x03\x01', msg[1], 's key id')
    assert.equal('\x08\x06\x04\x02', msg[2], 'r key id')
    assert.equal('foo', msg[3].substring(4), 'dhy')
    assert.equal('\x00\x00\x00\x00\xde\xad\xbe\xef', msg[4], 'ctr')
    assert.equal('encoded_dummy', msg[5].substring(4), 'encmsg')
    assert.equal('this is a dummy mac\x00', msg[6], 'mac')
    assert.equal('\x00\x00\x00\x00', msg[7], 'oldmacs')
  })

  it('should parse whitespace tags', function () {
    var msg = Parse.parseMsg(otr, 'this is a test' + CONST.WHITESPACE_TAG + ' random ' + CONST.WHITESPACE_TAG_V3 + CONST.WHITESPACE_TAG_V2)
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_2))
    assert.ok(~msg.ver.indexOf(CONST.OTR_VERSION_3))
    assert.equal(msg.msg, 'this is a test random ')
  })

})