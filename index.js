var qs = require('qs')

function parseBlacklightQuerystring (querystring) {
	var out = {
		query: '',
		facets: {},
		options: {},
	}

	if (!querystring || typeof querystring !== 'string')
		return out

	var parsed = parseNumbers(qs.parse(querystring.replace(/^\?/, '')))

	if (parsed.q) {
		out.query = parsed.q
		delete parsed.q
	}

	if (parsed.f) {
		out.facets = parsed.f
		delete parsed.f
	}

	out.options = parsed
	return out
}

function parseNumbers (obj) {
	for (var p in obj) {
		var val = obj[p]
		if (typeof val === 'object') {
			parseNumbers(obj[p])
			continue
		}

		if (val === '')
			continue

		if (+val === +val)
			obj[p] = +val
	}

	return obj
}

function stringifyBlacklightQuerystring (obj) {
	if (!obj || !Object.keys(obj).length)
		return ''

	var clean = {}

	if (obj.query) {
		clean.q = obj.query
		delete obj.query
	}

	if (obj.facets) {
		clean.f = obj.facets
		delete obj.facets
	}

	if (obj.options) {
		for (var o in obj.options) {
			clean[o] = obj.options[o]
		}
	}

	return qs.stringify(clean, {arrayFormat: 'brackets'})
		.replace(/%20/g, '+')
		.replace(/%E2%9C%93/g, '✓')
}

module.exports = {
	parse: parseBlacklightQuerystring,
	stringify: stringifyBlacklightQuerystring,
}
