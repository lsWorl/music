import {createRouter , createWebHashHistory, RouteRecordRaw} from 'vue-router'
//动态引入路由
const Recommend = ()=>import ('../page/Recommend.vue')
//引入音乐馆部分组件
const MusicMuseum = ()=>import('../page/MusicMuseum/index.vue')
const RankingList = ()=>import('../page/MusicMuseum/RankingList.vue')
const MusicMuseumList = ()=>import('../page/MusicMuseum/List.vue')
const SingerList = ()=>import('../page/MusicMuseum/SingerList.vue')
const MusicMuseumRecommend = ()=>import('../page/MusicMuseum/Recommend.vue')

const VedioPage = ()=>import('../page/VedioPage.vue')
const Audio = ()=>import('../page/Audio.vue')
const Like = ()=>import('../page/Like.vue')
const RecentPlay = ()=>import('../page/RecentPlay.vue')
const LiseningList = ()=>import('../page/LiseningList.vue')
//创建一个路由
const routes:Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/recommend/musicMuseum'
    },
    {
        path: '/recommend',
        // redirect: 'recommend',
        name: 'rcommend',
        component: Recommend,
        children:[
            {
                //音乐馆部分路由
                path: 'musicMuseum',
                component: MusicMuseum,
                redirect: '/recommend/musicMuseum/musicMuseumRecommend',
                children:[
                    {
                        path: 'musicMuseumRecommend',
                        name: 'musicMuseumRecommend',
                        component: MusicMuseumRecommend
                    },
                    {
                        path: 'rankingList',
                        name: 'rankingList',
                        component: RankingList
                    },
                    {
                        path: 'musicMuseumList',
                        name: 'musicMuseumList',
                        component: MusicMuseumList
                    },
                    {
                        path: 'singerList',
                        name: 'singerList',
                        component: SingerList
                    },
                ]
            },
            {
                path: 'vedioPage',
                name: 'VedioPage',
                component: VedioPage
            },
            {
                path: 'audio',
                name: 'Audio',
                component: Audio
            },
            {
                path: 'like',
                name: 'Like',
                component: Like
            },
            {
                path: 'recentPlay',
                name: 'RecentPlay',
                component: RecentPlay
            },
            {
                path: 'liseningList',
                name: 'LiseningList',
                component: LiseningList
            }
        ]
    },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router