blacklight-querystring
======================

[![Build Status](https://travis-ci.org/LafayetteCollegeLibraries/blacklight-querystring.svg?branch=master)](https://travis-ci.org/LafayetteCollegeLibraries/blacklight-querystring) [![NPM Version](https://img.shields.io/npm/v/blacklight-querystring.svg)](https://npmjs.com/package/blacklight-querystring)

Parse/stringify [Blacklight][1] query strings to/from normalized search objects. Uses [qs][2] under the hood. 

```
npm install blacklight-querystring
```

usage
-----

```javascript
var blqs = require('blacklight-querystring')
```

### `blqs.parse(queryString)`

Parses a query string generated by Blacklight into an object with `query`,
`facets`, and `options` keys. Values are uri-decoded and numeric-ish strings
are parsed into numbers.

`query` is the search query used against Blacklight. The value is url-decoded.
(default: `''`)

```javascript
var parsed = blqs.parse('q=cats+AND+dogs')
console.log(parsed.query)

// {
//   query: 'cats AND dogs',
// }
```

`facets` contains facet values found in the query string with the key wrapped
in `f[` and `][]`. (default: `{}`)

```javascript
var parsed = blqs.parse('f%5Bformat_physical%5D%5B%5D=Videocassette+(VHS)')
console.log(parsed.facets)

// {
//   facets: {
//     format_physical: [
//       'Videocassette (VHS)'
//     ]
//   }
// }
```

`options` contains values that are neither the `query` or `facets`. Keys/values
using object notation are parsed into objects. (default: `{}`)

```javascript
var parsed = blqs.parse('per_page=25&range%5Bpub_date%5D%5Bstart%5D=1990')
console.log(parsed.options)

// {
//   per_page: 25,
//   range: {
//     pub_date: {
//       begin: 1990
//     }
//   }
// }
```

### `blqs.stringify(obj)`

Converts an object with keys `query`, `facets`, and `options` into a query string
recognized by Blacklight. A `query` key is converted to the key `k` in the query
string, and `facets` to `f`.

```javascript
var obj = {
  query: 'cats AND dogs',
  facets: {
    format_physical: [
      'Videocassette (VHS)'
    ],
  },
  options: {
    per_page: 25,
    range: {
      pub_date: {
        begin: 1990
      }
    }
  }
}

console.log(blqs.stringify(queryObj))

// 'q=cats+AND+dogs&f%5Bformat_physical%5D%5B%5D=Videocassette+%28VHS%29&per_page=25&range%5Bpub_date%5D%5Bbegin%5D=1990'
```

license
-------
GPL-3.0

[1]: http://www.projectblacklight.org
[2]: https://www.npmjs.com/package/qs
