import instance from './axios';

export const loginMember = async (payload) => {
  const response = await instance.post('/api/login/', payload);
  return response.data;
};

export default loginMember;
