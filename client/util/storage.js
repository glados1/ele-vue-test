class Store {
	constructor() {
		this.store = window.localStorage;
		this.prefix = 'db_1_';
	}
	set(key, value, callback) {
		try {
			value = JSON.stringify(value);
		} catch (e) {
			value = value;
		}

		var prefix = this.prefix;

		this.store.setItem(prefix + key, value);

		callback && callback();
	}
	get(key, callback) {
		if(!key) {
			throw new Error('NO_KEY_ERROR');
			return;
		}

		if(typeof key == 'object') {
			throw new Error('KEY_CAN_NOT_BE_OBJECT');
			return;
		}
		
		var prefix = this.prefix;
		var value = this.store.getItem(prefix + key);

		if(value !== null) {
			try {
				value = JSON.parse(value);
			} catch (e) {
				value = value;
			}
		}
		callback && callback(value);
	}
	remove(key, callback) {
		var prefix = this.prefix;
		this.store.removeItem(prefix + key);
	}
};

export default new Store();