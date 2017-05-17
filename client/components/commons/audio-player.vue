<template>
	<div class="audio-view">
		<audio :src="audio.songUrl" id="audio-player" loop="loop"></audio>
		<div>
			<span v-loading="audioLoading"></span>
		</div>
		<div class="audio-panel">
			<img class="audio-player-image" :src="audio.imgSrc" alt=""/>
			<div class="audio-player-status">
				<p class="audio-player-title ellipsis">{{ audio.title }}</p>
				<p class="audio-player-singer ellipsis">{{ audio.singer }}</p>
			</div>
			<div class="audio-player-controls">
				<span class="audio-player-play" @click="toggleIsPlaying()" :class="{'audio-player-pause' : isPlaying}"></span>
				<span class="audio-player-next" @click="nextSong()"></span>
			</div>
		</div>
	</div>
</template>

<script type="es6">
	import { mapGetters } from 'vuex';

	export default {
		name : 'audio-player',
		data() {
			return {

				// audio, isPlaying, audioLoading 应该由 vuex 全局提供
				/*
				isPlaying : false,
				audio : {
					imgSrc : 'http://www.w3school.com.cn/i/compatible_chrome.gif',
					songUrl : 'http://www.w3school.com.cn/i/horse.ogg',
					title : 'this is song title',
					singer : 'this is singer'
				}
				*/
			};
		},

		methods : {
			toggleIsPlaying() {
				var isPlaying = this.isPlaying;
	
				var audio = document.getElementById('audio-player');

				if(isPlaying) {
					audio.pause();
				} else {
					audio.play();
				}

				this.$store.dispatch('toggle_is_playing');
			},

			nextSong() {
				
			}
		},

		computed : {
			...mapGetters(['audio', 'audioLoading', 'isPlaying'])
		}
	};
</script>

<style scoped>
.ellipsis{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.audio-panel{z-index: 999;width: 100%;height: 64px;background-color: rgba(0,0,0,0.8);padding: 7px;}
.audio-panel-control{width: 35px;height: 35px;border-radius: 50%;background: rgba(0,0,0,.8) url("../../../static/assets/images/close_icon.png") no-repeat center;background-size: 25px;margin-left: 10px;margin-bottom: 10px;overflow: hidden}
.audio-view{position: fixed;bottom:0;left: 0;width: 100%;transition: all .5s;-webkit-transition: all .5s}
.audio_panel_hide{bottom: -64px}
.toggleContral{background: rgba(0,0,0,.8) url("../../../static/assets/images/open_icon.png") no-repeat center;background-size: 25px !important;}
.audio-player-img{height: 100%;float: left;border-radius: 2px}
.audio-player-status{float: left;width: 50%;height: 100%;margin-left: 3%;padding: 5px 0;color: #fff;}
.audio-player-title{width: 100%;font-size: 16px;overflow: hidden;display: block;}
.audio-player-singer{display: block;height: 50%;width: 100%;color: #c4c4c4;padding-top: 2px}
.audio-player-controls{width: 30%;float: right;height: 100%}
.audio-player-controls span{display: block;width: 50%;height: 100%;float: left;}
.audio-player-play{background: url("../../../static/assets/images/play_icon.png") no-repeat center;background-size:auto 70%;}
.audio-player-pause{background: url("../../../static/assets/images/pause_icon.png") no-repeat center;background-size:auto 70%;}
.audio-player-next{background: url("../../../static/assets/images/next_icon.png") no-repeat center;background-size:auto 70%;}
.audio-view .mint-spinner-snake{background-color: #000;margin:4px}
.mint-navbar .mint-tab-item.is-selected{margin-bottom: 0}
</style>