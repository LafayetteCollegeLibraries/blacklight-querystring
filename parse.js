function parseBlacklightQuerystring (qs) {
  var out = {
    query: '',
    facets: {},
    options: {},
  }

  if (!qs || !(typeof qs === 'string'))
    return out

  if (qs[0] && qs[0] === '?')
    qs = qs.substring(1)

  // `decodeURI` will not transform `+` to ` `, so we'll need
  // to catch those _before_ decoding the whole uri (while strings
  // using `+` will be encoded as %2B)
  qs = qs.replace(/\+/g, ' ')
  qs = decodeURI(qs)

  var pairs = qs.split('&').map(function (p) { return p.split('=') })
  var facetReg = [/^f\[/, /\]\[\]$/]
  var i = 0

  for (; i < pairs.length; i++) {
    var key = pairs[i][0]
    var value = pairs[i][1]
    var cleaned

    if (/^-?[0-9]+$/.test(value))
      value = Number(value)

    if (key === 'q') {
      out.query = value
    }

    else if (key[0] === 'f' && key[1] === '[') {
      cleaned = key.replace(facetReg[0], '').replace(facetReg[1], '')

      if (out.facets[cleaned])
        out.facets[cleaned].push(value)
      else
        out.facets[cleaned] = [value]
    }

    else {
      out.options[key] = value
    }
  }

  return out
}

module.exports = parseBlacklightQuerystring
