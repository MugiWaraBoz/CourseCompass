import clientApi from './clientApi';

// User authentication API
export async function loginUser(credentials) {
  try {
    const response = await clientApi.post('/auth/adminLogin', credentials);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error?.message;
    throw new Error(message || 'Unable to login. Please try again.', {
      cause: error,
    });
  }
}
