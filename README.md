# koa-router-proxy
koa-router-proxy is a Koa proxy middleware。

### Usage
1. install
```
npm install koa-router-proxy
```

2. examples

```
const Koa = require('koa')
const router = require('koa-router')();
const koaRouterProxy = require('koa-router-proxy')

const app = new Koa();


router.get('/home/*', koaRouterProxy('*', {
    target: 'localhost:8000/', //目标服务器地址
    changeOrigin: true,
    rewrite: (path) => {
        return path.replace(`/home`, '');
    },
}))

app.use(router.routes());

app.listen(3000, () => {
    console.log('Listening 3000...')
});

```