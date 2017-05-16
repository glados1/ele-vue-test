export default {
	toggle_audio_loading : (state) => {
		state.audioLoading = !state.audioLoading;
	},

	set_audio : (state, audio) => {
		state.audio = audio;
	},

	set_is_playing : (state, isPlaying) => {
		state.isPlaying = isPlaying;
	},

	toggle_is_playing : (state) => {
		state.isPlaying = !state.isPlaying;
	}
};