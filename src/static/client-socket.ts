const RECONNECT_DELAY_MS = 1000,
	PING_INTERVAL_MS = 30 * 1000;

type ChannelListener = (data: any) => any;
type ChannelMessager = (channel: string, data?: any) => any;
// a 'channel' is just an event name
type ChannelSubscription = (channel: string, callback: ChannelListener) => any;
type SocketConsumer = ({ send, on }: { send: ChannelMessager; on: ChannelSubscription }) => any;

export function connectSocket(onConnected: SocketConsumer) {
	const protocol = location.protocol === 'https:' ? 'wss' : 'ws',
		ws = new WebSocket(`${protocol}://${location.hostname}`);
	ws.addEventListener('message', (msg) => {
		if (msg.data === 'pong') {
			return;
		}

		const [channel, data] = JSON.parse(msg.data);

		for (const listener of listeners[channel] || []) {
			listener(data);
		}
	});

	const listeners: Record<string, ChannelListener[]> = {},
		on: ChannelSubscription = (channel, callback) => {
			if (listeners[channel]) {
				listeners[channel].push(callback);
			} else {
				listeners[channel] = [callback];
			}
		},
		send = (channel: string, data: any = null) => {
			ws.send(JSON.stringify([channel, data]));
		};

	ws.addEventListener('open', () => {
		// need to ping occasionally to keep the connection alive
		function ping() {
			if (ws.readyState === WebSocket.OPEN) {
				ws.send('ping');
				setTimeout(ping, PING_INTERVAL_MS);
			}
		}
		ping();

		onConnected({
			on,
			send,
		});
	});

	//if the connection is closed we should try to reconnect it
	ws.addEventListener('close', () => {
		setTimeout(() => connectSocket(onConnected), RECONNECT_DELAY_MS);
	});
}
