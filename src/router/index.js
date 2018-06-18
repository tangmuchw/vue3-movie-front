import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)

// 配置路由
const router = new VueRouter({
  mode: 'hash',
  routes: routes
})

// router.beforeEach((to, from, next) => {
//   console.log('to', to)
//   console.log('params', getRequestFromSearch())

//   let fromDisableBackCondition = record => {
//     return record.meta.disableBack
//   }
//   let toDisableBackCondition = record => {
//     return (record.path.startsWith('/user') || record.path.startsWith('/paySuccess'))
//   }

//   if (from.matched.some(fromDisableBackCondition) && to.matched.some(toDisableBackCondition)) {
//     next(false)
//     return
//   }

//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (store.state.userInfo && store.state.userInfo.accountToken) {
//       next()
//     } else {
//       next({
//         path: '/login',
//         query: {redirect: to.fullPath}
//       })
//     }
//   } else {
//     next()
//   }
// })

export default router
// const Home = r => require.ensure([], () => r(require('@/view/home/Home')), 'home')
// // 影院
// const CinemaSelect = r => require.ensure([], () => r(require('@/view/cinema/CinemaSelect')), 'CinemaSelect')




// Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'home',
//       component: Home
//     },
//     {
//       path: '/cinema',
//       name: 'cinema',
//       component: CinemaSelect
//     }
//   ]
// })
