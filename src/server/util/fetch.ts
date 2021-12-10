import http from 'http';
import https from 'https';
import { URL } from 'url';

export default function fetch(url: string): any {
	return new Promise((resolve, reject) => {
		const isHttps = /^https/.test(url),
			u = new URL(url);

		const req = (isHttps ? https : http).request(
			{
				hostname: u.hostname,
				path: u.pathname + (u.search || ''),
				method: 'GET',
				agent: false,
				headers: {
					'User-Agent': 'Context.Reviews (https://context.reviews)',
				},
			},
			(res) => {
				let body = '';
				res.setEncoding('utf8');
				//do another request if we got redirected
				if (res.statusCode === 301) {
					fetch(u.protocol + u.hostname + res.headers.location).then(resolve, reject);
				} else {
					res.on('data', (data) => (body += data));
					res.on('end', () => resolve(body));
				}
			}
		);
		req.on('error', (e) => console.error(e));
		req.end();
	});
}
