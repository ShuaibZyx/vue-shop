import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/Users'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Cate from '../components/goods/Cate'
import Params from '../components/goods/Params'
import GoodsList from '../components/goods/List'
import AddGoods from '../components/goods/Add'
import EditGoods from '../components/goods/Edit'
import Order from '../components/order/Order'
import Report from '../components/report/Report'

Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/goods/addgoods', component: AddGoods },
        {
          name: 'editgoods',
          path: '/goods/editgoods/:goodId',
          component: EditGoods
        },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report },
      ]
    },
  ]
})

//挂载路由前置守卫
router.beforeEach((to, from, next) => {
  //to表示将要访问的路径
  //from表示从哪个路径而来
  //next表示是否放行next()放行 或 next('')跳转走
  if (to.path === '/login') return next()

  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
