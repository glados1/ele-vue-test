import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import user from './user/index';
import common from './common/index';
import router from './router/index';
import audio from './audio/index';
import uploader from './uploader/index';

export default new Vuex.Store({
	modules : {
		user,
		common,
		router,
		audio,
		uploader
	}
});

