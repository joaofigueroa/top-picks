import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '@/views/User/register'
import Profile from '@/views/User/profile'
import Home from '@/views/home'
import MovieDetailed from '@/views/Movies/movieDetailed'
import MovieByGenre from '@/views/Movies/movieByGenre'


Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "*",
    redirect: "/home",
  },
  {
    path: '/home',
    name: 'Home',
    meta: { forAuth: true },
    component: Home
  },
  {
    path: '/detalhes-filme/:name',
    name: 'MovieDetailed',
    meta: { forAuth: true },
    component: MovieDetailed
  },
  {
    path: '/filmes-genero/:name',
    name: 'MovieByGenre',
    meta: { forAuth: true },
    component: MovieByGenre
  },


  {
    path: '/cadastro',
    name: 'Register',
    meta: { forVisitors: true },
    component: Register
  },
  {
    path: '/perfil',
    name: 'Profile',
    meta: { forAuth: true },
    component: Profile
  },


]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
