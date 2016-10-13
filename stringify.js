function stringifyBlacklightQuery (obj) {
  var qs = []

  if (!obj)
    return ''

  if (obj.query) 
    qs.push('q=' + obj.query)

  for (var k in obj.facets) {
    var group = obj.facets[k]
    var key = 'f[' + k + '][]'

    for (var i = 0; i < group.length; i++)
      qs.push(key + '=' + group[i])
  }

  for (var o in obj.options)
    qs.push(o + '=' + obj.options[o])

  var joined = qs.join('&')
  return encodeURI(joined)
    .replace(/%20/g, '+')
    .replace(/%E2%9C%93/ig, '✓')
}

module.exports = stringifyBlacklightQuery
