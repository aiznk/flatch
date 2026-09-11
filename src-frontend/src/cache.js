export class Cache {
	constructor () {
		this.kv = {}
	}

	has (key) {
		return key in this.kv
	}

	get (key, defVal=null) {
		if (key in this.kv) {
			return this.kv[key]
		}
		return defVal
	}

	set (key, val) {
		this.kv[key] = val
	}
}
