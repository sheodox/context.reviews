export const createLinks = searchTerm => {
	const encoded = encodeURIComponent(searchTerm);

	return [
		{siteName: 'ALC', href: `http://eow.alc.co.jp/search?q=${encoded}`},
		{siteName: 'Goo', href: `https://dictionary.goo.ne.jp/srch/all/${encoded}/m0u/`},
		{siteName: 'Kotobank', href: `https://kotobank.jp/gs/?q=${encoded}`},
        //Sanseido stopped their dictionary service as of the end of Sept 2020, but are apparently working on a new version.
		//So until that new version is available I'm leaving this here as a reminder!
		// {siteName: 'Sanseido', href: `https://www.sanseido.biz/User/Dic/Index.aspx?DORDER=&DailyEJ=checkbox&DailyJE=checkbox&DailyJJ=checkbox&TWords=${encoded}&st=0`},
		{siteName: 'Weblio', href: `https://www.weblio.jp/content/${encoded}`},
		{siteName: 'Google', href: `https://www.google.com/search?q=${encoded}`},
		{siteName: 'Google Images', href: `https://www.google.com/search?q=${encoded}&tbm=isch`},
	]
}