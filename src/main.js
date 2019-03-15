import Vue from 'vue';
//注册一个app全局组件
import App from './app.vue'

//用于接收mint-ui的相关组件，按需引入
import Mint from 'mint-ui'; 
Vue.use(Mint); 

//引入mint-ui的样式
import 'mint-ui/lib/style.css'
//引入mui的相关文件
import './MUI/css/mui.css'
import './MUI/css/icons-extra.css'


//接受router.js中传进来的路由
import router from './router.js';

//注册一个axios
import axios from 'axios';
import VueAxios from 'vue-axios'
Vue.use(VueAxios,axios);
axios.defaults.baseURL = 'http://www.liulongbin.top:3005';

//引入moment的时间包
import moment from 'moment';
//注册一个全局的时间过滤器
Vue.filter('dateFormat',function(dateStr,pattern='YYYY-MM-DD HH:mm:ss'){
    return moment(dateStr).format(pattern);
})

// 注册一个全局组件
import comment from './components/subComponents/comment.vue';
Vue.component('comment',comment);
//注册轮播图全局组件
import lunbo from './components/subComponents/lunbotu.vue';
Vue.component('lunbo',lunbo);
//注册number框组件
import numberbox from './components/subComponents/numberBox.vue';
Vue.component('numberbox',numberbox);


//导入vue2-preview这个组件 用于后面制作缩略图
import VuePreview from 'vue2-preview';
Vue.use(VuePreview);

//导入vuex
import Vuex from 'vuex';
Vue.use(Vuex)
//创建vuex用于储存全局的数据和对象
var objCars = JSON.parse(localStorage.getItem('car') || '[]');
let store = new Vuex.Store({
    state: {
        objCar:objCars,//定义一个数组，用于传递商品的价格等信息
        flag:false ,//用于判断
    },
    mutations: {
        //定义一个方法，用于获取objCar
        getObjCar(state,data){
            state.objCar.some(item=>{
                if(item.id == data.id){
                    item.count =parseInt(item.count) + parseInt(data.count);
                    state.flag = true;
                    return true;
                }
            });
            if(state.flag == false){
                state.objCar.push(data);
            }  
            state.flag = false;
            localStorage.setItem('car',JSON.stringify(state.objCar));
        },
        //定义当购物车组件，商品修改时，购物车上的小球上的数值也跟着改变
        getValueChange(state,IdAndCount){
            state.objCar.some(item =>{
                if(item.id == IdAndCount.id){
                    item.count = IdAndCount.count;
                    return true;
                }
            })
            localStorage.setItem('car',JSON.stringify(state.objCar));
        },
        //删除购物车组件中要购买的商品
        delShopBox(state,obj){
            state.objCar.some(item =>{
                if(item.id == obj.id){ 
                    state.objCar.splice(obj.index,1);
                    return true;
                }
            })
            localStorage.setItem('car',JSON.stringify(state.objCar));
        },
        //购物车组件的swich的开关
        changeSwitch(state){    
            localStorage.setItem('car',JSON.stringify(state.objCar));
        }

    },
    getters: {
        //用于实现购物车上方小球的数值
        getCarCount(state){
            var carCount = 0;
            state.objCar.forEach(item => {
                carCount += parseInt(item.count);
            });
            return carCount;
        },
        //计算出购物车所需的id的数组格式
        getShopCarIds(state){
            var idlist = [];
            state.objCar.forEach(item => {
                idlist.push(item.id);
            });
            var ids = idlist.join(',');
            return ids;
        },
        //通过此方法的到{id：count}这样一个对象方便，其他的组件去调用，得到count
        getCountForId(state){
            var o = {};
            state.objCar.forEach(item => {
                o[item.id] = item.count;
                
            });
            return o;
        },
        //通过此方法获得购物车中被选中的总数量,还有价格
        getCountAndPriceForSelect(state){
            var count = 0;
            var price = 0;
            state.objCar.forEach(item => {
                if(item.select === true){
                    count += parseInt(item.count);
                    price += parseInt(item.count)*item.price;
                }
            });
            return {count,price};
        }
    }
})
//实列Vue对象
var vm =  new Vue({
    el:'#app',
    render: c=>c(App),
    router,
    store
})