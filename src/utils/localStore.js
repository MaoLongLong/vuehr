const setUser = (user) => {
  localStorage.setItem('USER', JSON.stringify(user));
};

const getUser = () => JSON.parse(localStorage.getItem('USER'));

const clearLocalStorage = () => {
  localStorage.removeItem('USER');
};

export { setUser, getUser, clearLocalStorage };
