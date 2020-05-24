import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Note from '../views/Note.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Home' }
  },
  {
    path: '/note/add',
    name: 'noteAdd',
    component: Note,
    meta: { title: 'New note' }
  },
  {
    path: '/note/:id',
    name: 'note',
    component: Note,
    props: true,
    meta: { title: 'Edit note' }
  },
  {
    path: '*',
    name: 'notFound',
    component: NotFound,
    meta: { title: '404 Not Found' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title + ' | Notes';
  next();
})

export default router
