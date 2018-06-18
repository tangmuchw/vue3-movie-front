import App from '../App'
// 影院
const CinemaView = r => require.ensure([], () => r(require('@/view/cinema/CinemaView')), 'CinemaSelect')
const HomeView = r => require.ensure([], () => r(require('@/view/home/HomeView')), 'Home')
const FilmView = r => require.ensure([], () => r(require('@/view/film/FilmView')), 'FilmView')
const FilmDetailView = r => require.ensure([], () => r(require('@/view/film/FilmDetailView')), 'FilmDetailView')
const LoginView = r => require.ensure([], () => r(require('@/view/login/LoginView')), 'LoginView')
const RegisterView = r => require.ensure([], () => r(require('@/view/reg/RegisterView')), 'RegisterView')
const FilmTimeView = r => require.ensure([], () => r(require('@/view/film/FilmTimeView')), 'FilmTimeView')
const SeatView = r => require.ensure([], () => r(require('@/view/seats/SeatView')), 'SeatView')
const OrderView = r => require.ensure([], () => r(require('@/view/order/OrderView')), 'OrderView')
const PayView = r => require.ensure([], () => r(require('@/view/pay/PayView')), 'PayView')
const FeedBackView = r => require.ensure([], () => r(require('@/view/mine/FeedBackView')), 'FeedBackView')
const MineSettingView = r => require.ensure([], () => r(require('@/view/mine/MineSettingView')), 'MineSettingView')
const MineNickNameView = r => require.ensure([], () => r(require('@/view/mine/MineNickNameView')), 'MineNickNameView')
const MineOrderView = r => require.ensure([], () => r(require('@/view/mine/MineOrderView')), 'MineOrderView')

export default [{
  path: '/',
  component: App, //顶层路由，对应index.html
  children: [ //二级路由。对应App.vue
    {
      path: '',
      redirect: {
        name: 'FilmView'
      }
    },
    {
      path: '/home',
      name: 'HomeView',
      component: HomeView,
      children: [{
        path: '',
        redirect: {
          name:'FilmView'
        }
      }, {
        path: 'film',
        name: 'FilmView',
        component: FilmView
      }]
    },
    // 影院 
    {
      path: '/cinema',
      name: 'CinemaView',
      component: CinemaView
    },
    {
      path: '/filmDetail',
      name: 'FilmDetailView',
      component: FilmDetailView
    },
    {
      path: '/login',
      name: 'LoginView',
      component: LoginView
    },
    {
      path: '/register',
      name: 'RegisterView',
      component: RegisterView
    },
    {
      path: '/filmTime',
      name: 'FilmTimeView',
      component: FilmTimeView
    },
    {
      path: '/seat',
      name: 'SeatView',
      component: SeatView
    },
    {
      path: '/order',
      name: 'OrderView',
      component: OrderView
    },
    {
      path: '/pay',
      name: 'PayView',
      component: PayView
    }, 
    {
      path: '/feedback',
      name: 'FeedBackView',
      component: FeedBackView
    },
    {
      path: '/mineSetting',
      name: 'MineSettingView',
      component: MineSettingView
    },
    {
      path: '/mineNickName',
      name: 'MineNickNameView',
      component: MineNickNameView
    },
    {
      path: '/mineOrder',
      name: 'MineOrderView',
      component: MineOrderView
    }
    
  ]
}]
