const extensionNamespace = (typeof browser !== 'undefined' ? browser : chrome),
	handlers = {
		addPhrase,
		removePhrase
	};

extensionNamespace.runtime.onMessage.addListener((message, sender, cb) => {
	const {
		handler,
		data
	} = message;

	if (handlers[handler]) {
		handlers[handler](data)
			.then(cb)

		return true;
	}
});

function addPhrase(phrase) {
	console.log(`adding phrase`, phrase);
	return request(
		`--server--/phrases/add/${encodeURIComponent(phrase)}?extension=1`
	)
}

function removePhrase(phrase) {
	console.log(`removing phrase`, phrase);
	return request(
		`--server--/phrases/remove/${encodeURIComponent(phrase)}?extension=1`
	)
}

async function request(url) {
	try {
		const res = await fetch(url)

		return {
			status: res.status,
			response: res.status === 200 ? await res.json() : null
		};
	}
	catch(e) {
		return {
			status: 0,
			response: null
		}
	}
}
