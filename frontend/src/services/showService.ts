import API from './api';
import { Show, ShowDetails } from '../types';

export interface CreateShowData {
  name: string;
  show_type: 'movie' | 'bus' | 'doctor';
  start_time: string;
  total_seats: number;
}

export const showService = {
  createShow: async (showData: CreateShowData) => {
    try {
      const { data } = await API.post<{ message: string; show: Show }>(
        '/shows',
        showData
      );
      return data;
    } catch (error) {
      throw error;
    }
  },

  getShows: async () => {
    try {
      const { data } = await API.get<Show[]>('/shows');
      return data;
    } catch (error) {
      throw error;
    }
  },

  getShowById: async (id: number) => {
    try {
      const { data } = await API.get<ShowDetails>(`/shows/${id}`);
      return data;
    } catch (error) {
      throw error;
    }
  },
};
