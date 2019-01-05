const http = require('http'),
    {URL} = require('url'),
    https = require('https');

function fetch(url) {
    return new Promise((resolve, reject) => {
        const isHttps = /^https/.test(url),
            u = new URL(url);

        const req = (isHttps ? https : http).request({
            hostname: u.hostname,
            path: u.pathname + (u.search || ''),
            method: 'GET',
            agent: false,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36p'
            }
        }, res => {
            let body = '';
            res.setEncoding('utf8');
            //do another request if we got redirected
            if (res.statusCode === 301) {
                fetch(u.protocol + u.hostname + res.headers.location)
                    .then(resolve, reject);
            }
            else {
                res.on('data', data => body += data);
                res.on('end', () => resolve(body));
            }
        });
        req.on('error', e => console.error(e));
        req.end();
    });
}

module.exports = fetch;
