import { createRouter, createWebHistory } from 'vue-router';

import HadesHome from '@/views/HadesHome.vue';
import HadesAnnouncement from '@/views/HadesAnnouncement.vue';
import HadesEquipment from '@/views/HadesEquipment.vue';
import HadesProperty from '@/views/HadesProperty.vue';
import HadesAccount from '@/views/HadesAccount.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HadesHome },
        { path: '/announcement', component: HadesAnnouncement },
        { path: '/equipment', component: HadesEquipment },
        { path: '/property', component: HadesProperty },
        { path: '/account', component: HadesAccount },
        { path: '/:pathMatch(.*)*', redirect: '/' },
        { path: '/:pathMatch(.*)', redirect: '/' },
    ],
});

export default router;
