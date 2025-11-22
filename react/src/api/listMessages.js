import instance from './axios';

const withAuth = (token) => (token ? { headers: { Authorization: `Token ${token}` } } : {});

export const listMessages = async (token) => {
  const response = await instance.get('/api/messages/', withAuth(token));
  return response.data;
};

export default listMessages;
