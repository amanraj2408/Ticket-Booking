import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showService } from '../services/showService';
import { bookingService } from '../services/bookingService';
import { ShowDetails, Booking, Seat } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState<ShowDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const loadShowDetails = async () => {
    try {
      setLoading(true);
      const data = await showService.getShowById(parseInt(id!));
      setShowDetails(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load show details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadShowDetails();
    }
  }, [id]);

  const toggleSeatSelection = (seatNumber: string) => {
    setSelectedSeats(prev =>
      prev.includes(seatNumber)
        ? prev.filter(s => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = async () => {
    if (!showDetails || selectedSeats.length === 0) return;

    try {
      setBookingLoading(true);
      setError('');
      const response = await bookingService.bookSeats(showDetails.show.id, selectedSeats);
      setBooking(response.booking);

      // Check booking status periodically
      const checkStatus = async () => {
        try {
          const statusResponse = await bookingService.getBookingStatus(response.booking.id);
          setBooking(statusResponse);

          if (statusResponse.status === 'confirmed' || statusResponse.status === 'failed') {
            // Reload show details to update seat availability
            loadShowDetails();
          } else if (statusResponse.status === 'pending') {
            // Continue checking
            setTimeout(checkStatus, 2000);
          }
        } catch (err) {
          console.error('Failed to check booking status:', err);
        }
      };

      setTimeout(checkStatus, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const getSeatStatus = (seat: Seat) => {
    if (selectedSeats.includes(seat.seat_number)) {
      return 'selected';
    }
    return seat.status;
  };

  const getSeatClass = (seat: Seat) => {
    const status = getSeatStatus(seat);
    const baseClass = "w-12 h-12 m-1 rounded border-2 cursor-pointer flex items-center justify-center text-sm font-semibold transition-colors";

    switch (status) {
      case 'available':
        return `${baseClass} bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-300`;
      case 'selected':
        return `${baseClass} bg-blue-500 border-blue-600 text-white`;
      case 'booked':
        return `${baseClass} bg-red-500 border-red-600 text-white cursor-not-allowed`;
      case 'locked':
        return `${baseClass} bg-yellow-500 border-yellow-600 text-white cursor-not-allowed`;
      default:
        return `${baseClass} bg-gray-300 border-gray-400 cursor-not-allowed`;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!showDetails) {
    return (
      <div className="text-center">
        <p className="text-red-600">Show not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { show, seats } = showDetails;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Seats</h1>

      {/* Show Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{show.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
          <p><strong>Type:</strong> {show.show_type}</p>
          <p><strong>Date:</strong> {new Date(show.start_time).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {new Date(show.start_time).toLocaleTimeString()}</p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Available Seats: {show.available_seats}/{show.total_seats}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Seat Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Select Seats</h3>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded mr-2"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 border-2 border-blue-600 rounded mr-2"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-500 border-2 border-red-600 rounded mr-2"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-500 border-2 border-yellow-600 rounded mr-2"></div>
            <span className="text-sm">Locked</span>
          </div>
        </div>

        {/* Seat Grid */}
        <div className="flex flex-wrap justify-center">
          {seats.map((seat) => (
            <button
              key={seat.id}
              onClick={() => toggleSeatSelection(seat.seat_number)}
              disabled={seat.status !== 'available' || bookingLoading}
              className={getSeatClass(seat)}
            >
              {seat.seat_number}
            </button>
          ))}
        </div>

        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>Selected Seats:</strong> {selectedSeats.join(', ')}
            </p>
            <p className="text-blue-600 mt-2">
              Total: {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Booking Status */}
      {booking && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Status</h3>
          <div className="space-y-2">
            <p><strong>Booking ID:</strong> {booking.id}</p>
            <p><strong>Seats:</strong> {booking.seat_ids.join(', ')}</p>
            <p>
              <strong>Status:</strong>
              <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                booking.status === 'confirmed'
                  ? 'bg-green-100 text-green-800'
                  : booking.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </span>
            </p>
            <p><strong>Booked At:</strong> {new Date(booking.booked_at).toLocaleString()}</p>
            {booking.status === 'confirmed' && booking.confirmed_at && (
              <p><strong>Confirmed At:</strong> {new Date(booking.confirmed_at).toLocaleString()}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </button>

        {selectedSeats.length > 0 && !booking && (
          <button
            onClick={handleBooking}
            disabled={bookingLoading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {bookingLoading ? 'Processing...' : 'Book Selected Seats'}
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
