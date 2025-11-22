import instance from './axios';

const withAuth = (token) => (token ? { headers: { Authorization: `Token ${token}` } } : {});

export const getProfile = async (token) => {
  const response = await instance.get('/api/profile/', withAuth(token));
  return response.data;
};

export default getProfile;
