<template>
	<div class="left" id="admin-left" :style="{'height' : winSize.height, 'width' : winSize.width}">
		<div id="left-menu">
			<el-row class="tac"
				v-for="(item, index) in $router.options.routes"
				v-if="(!item.hidden) && ($route.matched.length) && ($route.matched[0].path == item.path)">
				<el-col :span="24">
					<el-menu 
						theme="dark"
						unique-opened
						router
						:default-active="$route.path">
						<el-submenu 
							v-for="(subItem, subIndex) in item.children"
							v-if="!subItem.hidden"
							:index="subItem.path">
							<template slot="title">
								<el-tooltip
									class="item"
									effect="dark"
									placement="right"
									:content="subItem.name"
									:disabled="menuFlag">
									<i :class="'fa fa-'+subItem.icon"></i>
								</el-tooltip>
								<span class="menu-name" v-if="menuFlag">{{subItem.name}}</span>
							</template>
						    <el-menu-item 
						    	v-for="(sonItem, sonIndex) in subItem.children"
						    	v-if="!sonItem.hidden"
						    	:style="{'padding-left' : menuFlag ? '40px' : '23px'}"
						    	:index="header_cur_router + '/' + subItem.path + '/' + sonItem.path">
					    		<el-tooltip
									class="item"
									effect="dark" 
                                    placement="right"
                                    :content="sonItem.name"
                                    :disabled="menuFlag">
									<i :class="'fa fa-'+sonItem.icon"></i>
								</el-tooltip>
						    	<span class="menu-name">{{ sonItem.name }}</span>
						    </el-menu-item>
					  	</el-submenu>
					</el-menu>
				</el-col>
			</el-row>
			<div class="toggle-menu" @click="toggleMenu()">
				<i class='el-icon-arrow-left'></i>
			</div>
		</div>
	</div>
</template>

<script type="es6">
	export default {
		name : 'left-menu',
		data() {
			return {

			};
		},

		methods : {
			toggleMenu() {
				var event = this.menuFlag ? 'close_left_menu' : 'open_left_menu';
				this.$store.dispatch(event);
			}
		},

		computed : {
			winSize() {
				var height = (window.innerHeight || document.body.clientHeight) + 'px';
				var width = this.$store.state.common.leftMenuWidth;
				return {
					height,
					width
				};
			},

			menuFlag() {
				return this.$store.state.common.leftMenuFlag || false;
			},

			header_cur_router() {
				//return this.$store.state.router.header_cur_router || '/database';
				return this.$route.matched[0].path || this.$store.state.router.header_cur_router || '/database';
			}
		}
	};
</script>

<style scoped>
	.fa{
        margin-right: 8px;
    }
    .left-fixed-right-auto{
        padding-top: 60px;
    }
    .left{
        position:fixed;
        float:left;
        /*width:190px;
        margin-right:-190px;*/
        top:60px;
    }
    .right-content{
        float:right;
        width:100%;
    }
    #left-menu{
        height: 100%;
        background: #324057;
        position: relative;
        overflow-x: hidden;
        

        .toggle-menu{
            width: 100%;
            height: 50px;
            background: #1f2f3d;
            position: absolute;
            bottom: 50px;
            left: 0px;
            z-index: 1000;
            cursor: pointer;
            line-height: 40px;
            text-align: center;
            color: #fff;
            font-size: 14px;
        }
    }
</style>