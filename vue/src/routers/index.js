import Vue from 'vue';
import Router from 'vue-router';

import contactsRouter from './contactsRouter';
import loginRouter from './loginRouter';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		...contactsRouter,
		...loginRouter,
	],
});