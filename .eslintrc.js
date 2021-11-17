module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"node": true,
		"common": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 13,
		"sourceType": "module"
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		"semi": [
			"error",
			"never"
		]
	}
}
