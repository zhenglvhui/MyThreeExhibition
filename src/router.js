//用于接收和传递路由和组件的页面
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import home from './components/tabbar/home.vue';
import My from './components/tabbar/my.vue';
import buyCar from './components/tabbar/buyCar.vue';
import signIn from './components/tabbar/signIn.vue';
import NewsInfo from './components/news/newsInfo.vue';
import NewsDetail from './components/news/newsDetail.vue';
import PhotoHome from './components/photo/photoHome.vue';
import PhotoDetail from './components/photo/photoDetail.vue';
import ShopList from './components/shop/shopList.vue';
import ShopDetail from './components/shop/shopDetail.vue';
import searchShopDetail from './components/shop/searchShopDetail.vue';
import shopComment from './components/shop/shopComment.vue';
import LeaveMessage from './components/leaveMessage/leaveMessage.vue';
import Video from './components/videoc/video.vue';
import callMe from './components/callme/callme.vue';
import Regiest from './components/user/regiest.vue';
var router = new VueRouter({
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: home },
        { path: '/my', name:'my',component: My },
        { path: '/buyCar', component: buyCar },
        { path: '/signIn', component: signIn },
        { path: '/home/newsInfo', component: NewsInfo },
        { path: '/home/newsDetail/:id', component: NewsDetail },
        { path: '/home/photoHome', component: PhotoHome },
        { path: '/home/photoHome/photoDetail/:id', component: PhotoDetail },
        { path: '/home/shopList', name: 'shopList', component: ShopList },
        { path : '/home/shopDetail/:id',name: 'shopDetail' ,component:ShopDetail},
        { path: '/home/searchShopDetail/:id',name:'searchShopDetail', component: searchShopDetail },
        { path: '/home/shopComment/:id',name:'shopComment', component: shopComment },
        { path: '/home/leaveMessage',name:'leaveMessage',component:LeaveMessage},
        { path: '/home/video',name:'video',component:Video},
        { path: '/home/callme',name:'callMe',component:callMe},
        { path: '/user/regiest',name:'regiest', component: Regiest }
    ],
    linkActiveClass: 'mui-active'
})

export default router;