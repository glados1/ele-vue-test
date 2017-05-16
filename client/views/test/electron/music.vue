<template>
	<div class="music">
		<div class="music_list">
			<el-col :span="24" style="margin-bottom:20px;">
				<!-- 删除按钮 -->
				<el-button type="danger" 
					icon="delete" :disabled="!delete_active"
					@click="removeSong()">
					删除选中	
				</el-button>
			</el-col>

			<!-- 用户信息表格 -->
			<el-table :data="songList" 
				border style="width:100%" align="center" 
				@selection-change="songListSelectionChange">

				<!-- 删除的 checkbox -->
				<el-table-column type="selection" width="55"></el-table-column>

				<el-table-column 
					prop="title"
					label="标题"
					align="center"
					width="150"
					:sortable="true">
				</el-table-column>

				<el-table-column 
					prop="singer"
					label="歌手"
					align="center"
					:sortable="true">
				</el-table-column>

				<el-table-column 
					prop="songUrl"
					label="歌曲 url"
					align="center"
					:sortable="true">
				</el-table-column>

				<el-table-column
					label="操作"
					:width="200">

					<template scope="scope">
						<el-button 
							type="info"
							icon="edit"
							size="mini"
							@click="setAudio(scope.row)">
						</el-button>

						<el-button 
							type="danger"
							icon="delete"
							size="mini"
							@click="removeSong(scope.row)">
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<audio-player></audio-player>
	</div>
</template>

<script type="es6">

	import commons from '../../../components/commons/index';

	export default {
		name : 'music',

		data() {
			return {
				songList : [],
				delete_active : false,
				deletedSongs : []
			};
		},

		created() {
			this.getSongList();
		},

		methods : {
			loadAudio(audio) {
				this.$store.dispatch('load_audio', audio);
			},
			setAudio(audio) {
				/*
				console.log(audio);
				this.$store.dispatch('set_audio', audio);
				*/
				this.loadAudio(audio);
			},

			songListSelectionChange(selectedSongList) {
				if(selectedSongList.length) {

					this.deletedSongs = selectedSongList;


					this.delete_active = true;
				} else {
					this.delete_active = false;
				}
			},

			removeSong(songItem) {
				var removeSongIds = [];
				if(songItem) {
					removeSongIds.push(songItem._id);
				} else {
					var deletedSongs = this.deletedSongs;

					for(var i=0,len=deletedSongs.length;i<len;i++) {
						removeSongIds.push(deletedSongs[i]._id);
					}
				}

				removeSongIds.sort();

				var removeSongIdsStr = removeSongIds.join(',');
				console.log(removeSongIdsStr);
			},

			getSongList() {
				this.songList = [
					{
						_id : 1,
						imgSrc : 'http://www.w3school.com.cn/i/compatible_chrome.gif',
						songUrl : 'http://www.w3school.com.cn/i/song.mp3',
						title : 'song',
						singer : 'song singer'
					}, {
						_id : 2,
						imgSrc : 'http://www.w3school.com.cn/i/compatible_chrome.gif',
						songUrl : 'http://www.w3school.com.cn/i/horse.ogg',
						title : 'horse',
						singer : 'horse singer'
					}, {
						_id : 3,
						imgSrc : 'http://www.w3school.com.cn/i/compatible_chrome.gif',
						songUrl : 'http://www.w3school.com.cn/i/horse.ogg',
						title : 'this is song title',
						singer : 'this is singer'
					}, {
						_id : 4,
						imgSrc : 'http://www.w3school.com.cn/i/compatible_chrome.gif',
						songUrl : 'http://www.w3school.com.cn/i/horse.ogg',
						title : 'this is song title',
						singer : 'this is singer'
					}, {
						_id : 5,
						imgSrc : 'http://www.w3school.com.cn/i/compatible_chrome.gif',
						songUrl : 'http://www.w3school.com.cn/i/horse.ogg',
						title : 'this is song title',
						singer : 'this is singer'
					}
				];
			}
		},

		components : {
			audioPlayer : commons.audioPlayer
		}
	};
</script>

<style scoped>
	.music_list {

	}
</style>