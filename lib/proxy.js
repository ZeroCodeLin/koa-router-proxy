"use strict";
const pathToRegExp = require("path-to-regexp");
const http_proxy_1 = require("http-proxy");
const Log = require("./common/mylogger");
const mylogger = new Log();
/**
 * Koa Http Proxy Middleware
 */
function KoaRouterProxy(context, options) {
    // 特殊处理 *
    const contextRegExp = pathToRegExp(context === '*' ? '(.*)' : context);
    return async (ctx, next) => {
        const opts = options || {};
        // 配置了context并且请求路径不匹配，跳过此转发
        if (context && !contextRegExp.test(ctx.url)) {
            return await next();
        }
        return new Promise((resolve, reject) => {
            const oldPath = ctx.url;
            const requestTime = Date.now();
            const { rewrite } = opts;
            if (typeof rewrite === 'function') {
                // reset ctx url
                ctx.req.url = rewrite(oldPath);
            }
            const targetUrl = opts.target + ctx.url;
            mylogger.info(ctx.method, `${oldPath} -> ${targetUrl}`);
            /**
             * Constants
             */
            const proxy = http_proxy_1.createProxyServer();
            proxy.on('proxyReq', (proxyReq, req, res) => {
                // 清除前面带过来的xff信息
                proxyReq.removeHeader('X-Forwarded-For');
                if (ctx.request.body || req.body) {
                    const bodyData = JSON.stringify(ctx.request.body || req.body);
                    // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
                    proxyReq.setHeader('Content-Type', 'application/json');
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    // stream the content
                    proxyReq.write(bodyData);
                }
            });
            proxy.on('end', (req, res, proxyRes) => {
                mylogger.success(req.method, `${oldPath} -> ${targetUrl}`, res.statusCode, Date.now() - requestTime);
                // resolve promise
                resolve();
            });
            // buffer: streamify(req.rawBody)
            const httpProxyOpts = Object.keys(opts)
                .filter((n) => ['rewrite', 'reStream'].indexOf(n) < 0)
                .reduce((prev, cur) => {
                prev[cur] = opts[cur];
                return prev;
            }, {});
            proxy.web(ctx.req, ctx.res, httpProxyOpts, (err, req, res, proxyUrl) => {
                mylogger.error(ctx.method, `${oldPath} -> ${targetUrl}`, 500, Date.now() - requestTime, err.message);
                reject(err);
            });
        });
    };
}
module.exports = KoaRouterProxy;