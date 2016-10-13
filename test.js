var test = require('tape')
var blqs = require('./')
var parse = blqs.parse
var stringify = blqs.stringify

var hasOwnProperty = Object.prototype.hasOwnProperty

test('parse', function (_t) {
  _t.test('parses querystring into object', function (t) {
    var qs = 'q=cats&f%5Btype][]=cute&f[type][]=cuddly&per_page=25'
    var expected = {
      query: 'cats',
      facets: {
        type: ['cute', 'cuddly'],
      },
      options: {
        per_page: 25
      }
    }

    var parsed = parse(qs)

    t.deepEqual(parsed, expected)
    t.end()
  })

  _t.test('skips over leading question-mark', function (t) {
    var qs = '?q=cats&per_page=25&page=2'
    var expected = {
      query: 'cats',
      facets: {},
      options: {
        per_page: 25,
        page: 2,
      }
    }

    t.deepEqual(parse(qs), expected)
    t.end()
  })

  _t.test('replaces `+` and `%20` with spaces', function (t) {
    var qs = '?q=cats+and+dogs&f[type][]=Videocassette%20(VHS)'
    var expected = {
      query: 'cats and dogs',
      facets: {
        type: ['Videocassette (VHS)']
      },
      options: {}
    }

    t.deepEqual(parse(qs), expected)
    t.end()
  })

  _t.test('empty qs returns stock object', function (t) {
    var empties = {
      'undefined': undefined,
      "''": '',
      '{}': {},
      '[]' : [],
      'null': null,
    }

    var expected = {
      query: '',
      facets: {},
      options: {},
    }

    Object.keys(empties).forEach(function (kind) {
      var parsed = parse(empties[kind])
      t.deepEqual(parsed, expected, kind + ' generates an empty query object')      
    })

    t.end()
  })
})

test('stringify', function (_t) {
  _t.test('converts object into query string', function (t) {
    var obj = {
      query: 'cats',
      facets: {
        type: ['cute', 'cuddly'],
      },
      options: {
        per_page: 25
      }
    }

    var expect = 'q=cats&f%5Btype%5D%5B%5D=cute&f%5Btype%5D%5B%5D=cuddly&per_page=25'

    t.equal(stringify(obj), expect)
    t.end()
  })

  _t.test('converts %20 spaces to +', function (t) {
    var obj = {
      query: 'cats and dogs',
    }

    var expect = 'q=cats+and+dogs'

    t.equal(stringify(obj), expect)
    t.end()
  })

  _t.test('retains ✓', function (t) {
    var obj = {
      options: {
        utf8: '✓',
      }
    }

    var expect = 'utf8=✓'

    t.equal(stringify(obj), expect)
    t.end()
  })

  _t.test('empty object becomes an empty string', function (t) {
    t.equal(stringify(), '')
    t.equal(stringify({}), '')
    t.equal(stringify([]), '')
    t.end()
  })
})
