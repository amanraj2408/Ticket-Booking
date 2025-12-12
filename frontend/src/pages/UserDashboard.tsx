import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { showService } from '../services/showService';
import { bookingService } from '../services/bookingService';
import { Show, Booking } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const UserDashboard: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [showsData, bookingsData] = await Promise.all([
        showService.getShows(),
        bookingService.getBookings(),
      ]);
      setShows(showsData);
      setBookings(bookingsData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Available Shows */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Shows/Trips</h2>
        {shows.length === 0 ? (
          <p className="text-gray-600">No shows available at the moment.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shows.map((show) => (
              <div key={show.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{show.name}</h3>
                <p className="text-gray-600 mb-2">Type: {show.show_type}</p>
                <p className="text-gray-600 mb-2">
                  Date: {new Date(show.start_time).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-4">
                  Time: {new Date(show.start_time).toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Available Seats: {show.available_seats}/{show.total_seats}
                </p>
                <Link
                  to={`/booking/${show.id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full block text-center"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Bookings */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">You haven't made any bookings yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Show
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booked At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.show_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.seat_ids.join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.booked_at).toLocaleDateString()}
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

export default UserDashboard;
