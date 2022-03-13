import { writable, derived } from 'svelte/store';
import { getSetting, settingNames } from '../extension-utils';

interface Toast {
	ttl?: number;
	duration?: number;
	hidden?: boolean;
	id?: number;
	type?: string;
	text: string;
	phrases?: {
		phrase: string;
		phrase_id: string;
	}[];
}

export const toasts = writable<Toast[]>([]);
let expirationPaused = false;

function batchUpdateToasts(perToastCallback: (toast: Toast) => void) {
	toasts.update((toasts) => {
		toasts.forEach(perToastCallback);
		return toasts;
	});
}

export function pauseExpiration() {
	expirationPaused = true;
	batchUpdateToasts((toast) => {
		toast.ttl = toast.duration;
	});
}
export function resumeExpiration() {
	expirationPaused = false;
}

export function replayToasts() {
	batchUpdateToasts((toast) => {
		toast.ttl = toast.duration;
		toast.hidden = false;
	});
}

let lastFrame = Date.now();
function onFrame() {
	requestAnimationFrame(onFrame);
	const now = Date.now(),
		frameDelta = now - lastFrame;
	lastFrame = now;

	if (expirationPaused) {
		return;
	}

	toasts.update((toasts) => {
		toasts.forEach((toast) => {
			if (!toast.hidden) {
				toast.ttl -= frameDelta;

				if (toast.ttl <= 0) {
					toast.hidden = true;
				}
			}
		});
		return toasts;
	});
}
onFrame();

export const hasHiddenToasts = derived(toasts, (toasts) => {
	return toasts.some((toast) => toast.hidden);
});

//called when a toast is dismissed with the 'x' button
export function hideToast(id: number) {
	batchUpdateToasts((toast) => {
		if (toast.id === id) {
			toast.hidden = true;
		}
	});
}
let toastId = 0;
export async function addToast(toast: Toast) {
	const initiallyHidden = await getSetting(settingNames.initiallyHideToasts);

	toast.id = toastId++;
	toast.duration = 5000;
	toast.ttl = initiallyHidden ? 0 : toast.duration;
	toast.hidden = false;

	toasts.update((toasts) => {
		return [...toasts, toast];
	});
}
