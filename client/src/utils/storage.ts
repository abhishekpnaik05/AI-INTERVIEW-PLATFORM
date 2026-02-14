const USER_KEY = 'user';
const TOKEN_KEY = 'token';

export const storage = {
  getUser: (): string | null => localStorage.getItem(USER_KEY),
  setUser: (user: string) => localStorage.setItem(USER_KEY, user),
  removeUser: () => localStorage.removeItem(USER_KEY),

  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  clear: () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },
};
