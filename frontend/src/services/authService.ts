import API from './api';
import { LoginResponse } from '../types';

export const authService = {
  register: async (email: string, password: string, role: string = 'user') => {
    try {
      const { data } = await API.post<{ message: string; userId: string }>(
        '/auth/register',
        { email, password, role }
      );
      return data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data } = await API.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
};