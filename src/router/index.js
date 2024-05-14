import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PerceptionTest from "@/components/PerceptionTest.vue";
import TestForm from "@/components/TestForm.vue";
import FinishPage from "@/views/FinishPage.vue";
import FinishScreen from "@/components/FinishScreen.vue";
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/perceptiontest',
            name: 'perceptiontest',
            component: PerceptionTest,
        },
        {
            path: '/test-completed',
            name: 'test-completed',
            component: FinishScreen
        }
    ]
})

export default router
