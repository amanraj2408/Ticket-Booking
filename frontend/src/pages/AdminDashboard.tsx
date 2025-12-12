import React, { useState, useEffect } from 'react';
import { showService } from '../services/showService';
import { Show } from '../types';
import { useForm } from '../hooks/useForm';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    try {
      setLoading(true);
      const showsData = await showService.getShows();
      setShows(showsData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load shows');
    } finally {
      setLoading(false);
    }
  };

  const { values, handleChange, handleSubmit, isSubmitting, resetForm } = useForm(
    {
      name: '',
      show_type: 'movie',
      start_time: '',
      total_seats: '',
    },
    async (values: { name: string; show_type: string; start_time: string; total_seats: string }) => {
      try {
        setError('');
        await showService.createShow({
          name: values.name,
          show_type: values.show_type as 'movie' | 'bus' | 'doctor',
          start_time: values.start_time,
          total_seats: parseInt(values.total_seats),
        });
        setSuccess('Show created successfully!');
        resetForm();
        loadShows();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to create show');
      }
    }
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Create Show Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Show/Trip</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Show/Bus/Doctor Name"
                required
              />
            </div>

            <div>
              <label htmlFor="show_type" className="block text-gray-700 text-sm font-bold mb-2">
                Type
              </label>
              <select
                id="show_type"
                name="show_type"
                value={values.show_type}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="movie">Movie</option>
                <option value="bus">Bus</option>
                <option value="doctor">Doctor Appointment</option>
              </select>
            </div>

            <div>
              <label htmlFor="start_time" className="block text-gray-700 text-sm font-bold mb-2">
                Start Time
              </label>
              <input
                type="datetime-local"
                id="start_time"
                name="start_time"
                value={values.start_time}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label htmlFor="total_seats" className="block text-gray-700 text-sm font-bold mb-2">
                Total Seats
              </label>
              <input
                type="number"
                id="total_seats"
                name="total_seats"
                value={values.total_seats}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Number of seats"
                min="1"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Show'}
          </button>
        </form>
      </div>

      {/* Shows List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">All Shows/Trips</h2>
        </div>
        {shows.length === 0 ? (
          <div className="px-6 py-4 text-gray-600">No shows created yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shows.map((show) => (
                  <tr key={show.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{show.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{show.show_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(show.start_time).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{show.total_seats}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{show.available_seats}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
