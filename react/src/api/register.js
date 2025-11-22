import instance from './axios';

export const registerMember = async (payload) => {
  const response = await instance.post('/api/register/', payload);
  return response.data;
};

export default registerMember;
