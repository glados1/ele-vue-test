<template>
	<div>this is remote</div>
</template>

<script type="es6">
	import { remote } from 'electron';

	var Menu = remote.Menu;
	var MenuItem = remote.MenuItem;
	var Tray = remote.Tray;
	var nativeImage = remote.nativeImage;

	export default {
		data() {
			return {
				menu : []
			};
		},

		created() {
			this.init();
		},

		methods : {
			init() {
				this.addContextMenu();
				this.changeGlobalMenu();
				this.addTray();
			},

			addContextMenu() {
				var menu = new Menu();
				var menuItem_1 = new MenuItem({
					label : 'Electron',
					submenu : [
						{
							label : 'console test',
							click() {
								console.log('test');
							}
						}, {
							label : 'checked',
							type : 'checkbox',
							checked : true
						}, {
							label : 'gender',
							submenu : [
								{
									label : 'male',
									type : 'radio',
									checked : true
								}, {
									label : 'female',
									type : 'radio',
									checked : false
								}, {
									label : 'secret',
									type : 'radio',
									checked : true
								}
							]
						}
					]
				});

				menu.append(menuItem_1);

				window.addEventListener('contextmenu', function (e) {
					e.preventDefault();
					menu.popup(remote.getCurrentWindow());
				}, false);
			},

			changeGlobalMenu() {
				var template = [
					{
						label : 'Edit',
						submenu : [
							{
								label : 'Undo',
								accelerator : 'CmdOrCtrl+Z',
								role : 'undo'
							}
						]
					}, {
						label : 'devtool',
						accelerator : process.platform === 'darwin' ? 'CmdOrCtrl+I' : 'CmdOrCtrl+I',
						click(item, focusWindow) {
							if(focusWindow) {
								focusWindow.webContents.toggleDevTools();
							}
						}
					}, {
						label : 'GOOD BYE',
						role : 'quit',
						accelerator : 'CmdOrCtrl+Q'
					}, {
						label : 'Reload',
						accelerator : 'CmdOrCtrl+R',
						click(item, focusWindow) {
							focusWindow.reload();
						}
					}
				];

				var menu = Menu.buildFromTemplate(template);
				Menu.setApplicationMenu(menu);

			},

			addTray() {
				var image = nativeImage.createFromPath('C:/Users/wjh/Desktop/psd/icon1.jpg');
				var tray = new Tray(image);

				var template = [
					{
						label : 'show',
						accelerator : 'CmdOrCtrl+1',
						click() {
							remote.getCurrentWindow().show();
							
						}
					}, {
						label : 'Exit',
						role : 'quit'
					}, {
						label : 'hide',
						accelerator : 'CmdOrCtrl+2',
						click(item, focusWindow) {
							remote.getCurrentWindow().hide();
						}
					}
				];

				var contextMenu = Menu.buildFromTemplate(template);

				tray.setToolTip('this is my application');
				tray.setContextMenu(contextMenu);

			}
		}
	};
</script>

<style>
	
</style>