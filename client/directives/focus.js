export default {
	bind(el, binding) {
		if(binding.value) {
			el.focus();
		}
	},

	inserted(el, binding) {
		el.focus();
	},

	update(el, binding) {
		if(!binding.oldValue && binding.value) {
			el.focus();
		}
	}
};