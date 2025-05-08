import { writable } from 'svelte/store';

export const userStore = writable({
	id: 0,
	name: '',
	profileImage: ''
});
