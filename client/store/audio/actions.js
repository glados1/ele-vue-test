export default {
	toggle_audio_loading : ({
		commit
	}) => {
		commit('toggle_audio_loading');
	},

	set_audio : ({
		commit
	}, audio) => {
		commit('set_audio', audio);
	},

	load_audio : ({
		commit
	}, audio) => {
		commit('toggle_audio_loading');
		
		setTimeout(() => {
			commit('set_audio', audio);
			commit('toggle_audio_loading');
			commit('set_is_playing', false);
		}, 1000);

	},

	toggle_is_playing : ({
		commit
	}) => {
		commit('toggle_is_playing');
	}

};