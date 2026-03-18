export { default as PrintLayout } from './PrintLayout.svelte';

export function triggerPrint() {
	window.print();
}
