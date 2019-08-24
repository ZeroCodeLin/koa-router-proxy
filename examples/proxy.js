const koaRouterProxy = require('../lib/proxy.js')
const router = require('koa-router')();

router.get('/home/*', koaRouterProxy('*', {
    target: 'https://xiaoce-timeline-api-ms.juejin.im/', //目标服务器地址
    changeOrigin: true,
    rewrite: (path) => {
        return path.replace(`/home`, '');
    },
}))


module.exports = router