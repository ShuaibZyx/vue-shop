import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home },
  ]
})

//挂载路由前置守卫
router.beforeEach((to, from ,next) => {
    //to表示将要访问的路径
    //from表示从哪个路径而来
    //next表示是否放行next()放行 或 next('')跳转走
    if (to.path === '/login') return next()

    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')
    next()
})

export default router
