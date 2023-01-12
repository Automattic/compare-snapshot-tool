function generateMShotsUrl(targetUrl) {
	let url = new URL('https://s0.wp.com/mshots/v1/');
	url.pathname = url.pathname + targetUrl;
	url.searchParams.append('screen_height', '3200');
	return url.href;
}

export default generateMShotsUrl;