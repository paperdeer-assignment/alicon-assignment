import { goto } from '$app/navigation';
import { userStore } from '$lib/store/user';

export const useLogout = () => {
	const logout = async () => {
		await fetch('/api/user/logout', {
			method: 'POST'
		});

		userStore.set({
			id: null,
			name: '',
			profileImage: ''
		});
		await goto('/auth/login', { invalidateAll: true });
	};

	return { logout };
};
