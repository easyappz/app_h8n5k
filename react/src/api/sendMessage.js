import instance from './axios';

export const sendMessage = async (payload, token) => {
  if (!token) {
    throw new Error('Authorization token is required.');
  }

  const response = await instance.post('/api/messages/', payload, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return response.data;
};

export default sendMessage;
