const express = require('express');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const app = express();

app.use('/proxy/premium', createProxyMiddleware({
    target: 'https://www.premiumprogram.es',
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite: {
        '^/proxy/premium': '',
    },
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        res.removeHeader('x-frame-options');
        res.removeHeader('content-security-policy');
        
        if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('text/html')) {
            let html = responseBuffer.toString('utf8');
            html = html.replace(/(href|src|action)=["']\/(?!\/)/g, '$1="/proxy/premium/');
            html = html.replace(/(href|src|action)=["']https:\/\/www\.premiumprogram\.es\//g, '$1="/proxy/premium/');
            return html;
        }
        return responseBuffer;
    })
}));

const server = app.listen(3005, () => {
    console.log('Test server running on 3005');
    const http = require('http');
    http.get('http://localhost:3005/proxy/premium/login_page', (res) => {
        console.log('Headers:', res.headers);
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Contains /proxy/premium/?:', data.includes('/proxy/premium/'));
            server.close();
        });
    });
});
