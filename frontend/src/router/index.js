import { createRouter, createWebHistory } from 'vue-router';

import HadesHome from '../components/HadesHome.vue';
import HadesAnnouncement from '../components/HadesAnnouncement.vue';
import HadesEquipment from '../components/HadesEquipment.vue';
import HadesProperty from '../components/HadesProperty.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HadesHome },
        { path: '/announcement', component: HadesAnnouncement },
        { path: '/equipment', component: HadesEquipment },
        { path: '/property', component: HadesProperty },
    ],
});

export default router;
