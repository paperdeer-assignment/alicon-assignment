import { writable } from 'svelte/store';

export const userStore = writable<{
	id: number | null;
	name: string;
	profileImage: string;
}>({
	id: null,
	name: '',
	profileImage: ''
});
