/*
This file is a general build file for any custom build steps
website assets that aren't coverd by 'tsc' or 'webpack'
 */
const fs = require('fs'),
	pug = require('pug');

/*
Generate static error page HTML files. These are generated during dev and checked into version control
so they can be mounted into the nginx container and served without the nodejs app being available,
because on 502 errors which happen when the nodejs server is down there's no static files here to proxy.
 */
const httpErrors = [{
	status: 404,
	message: 'Not Found',
	description: `I'm not sure how you got here, but there doesn't seem to be anything here.`
}, {
	//gateway error. usually happens when the app image doesn't boot, or is being replaced
	status: 502,
	message: 'Site is down!',
	description: `Context.Reviews is down, try again in a moment.`
}];

const genErrorHtml = pug.compileFile('./src/views/error.pug')
for (const error of httpErrors) {
	const html = genErrorHtml(Object.assign({
			title: `${error.message} - Context.Reviews`
		},
		error));
	fs.writeFileSync(`./config/nginx-static/${error.status}.html`, html);
}

//the error pages need the logo files copy them there
const logo = fs.readFileSync('./public-src/favicon.png');
fs.writeFileSync('./config/nginx-static/favicon.png', logo);

console.log('extra-build done');
