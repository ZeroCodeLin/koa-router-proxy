const Koa = require('koa')
const path = require('path')
const router = require('koa-router')();
const rou = require('./proxy.js')
const app = new Koa();

router.get('/', async (ctx, next) => {
    ctx.body = {
        code: 200
    }
})

app.use(rou.routes());

app.listen(3000, () => {
    console.log('Listening 3000...')
});