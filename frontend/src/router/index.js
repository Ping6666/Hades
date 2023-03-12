import { createRouter, createWebHistory } from 'vue-router';

import HadesHome from '@/views/HadesHome.vue';
import HadesAnnouncement from '@/views/HadesAnnouncement.vue';
import HadesEquipment from '@/views/HadesEquipment.vue';
import HadesProperty from '@/views/HadesProperty.vue';
import HadesLog from '@/views/HadesLog.vue';

import HadesLogin from '@/views/HadesLogin.vue';
import HadesRegister from '@/views/HadesRegister.vue';

import HadesAccount from '@/views/HadesAccount.vue';
import HadesLogout from '@/views/HadesLogout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HadesHome },
        { path: '/announcement', component: HadesAnnouncement },
        { path: '/equipment', component: HadesEquipment },
        { path: '/property', component: HadesProperty },
        { path: '/log', component: HadesLog },


        { path: '/login', component: HadesLogin },
        { path: '/register', component: HadesRegister },

        { path: '/account', component: HadesAccount },
        { path: '/logout', component: HadesLogout },

        { path: '/:pathMatch(.*)*', redirect: '/' },
        { path: '/:pathMatch(.*)', redirect: '/' },
    ],
});

export default router;
