import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/HotelsPage.css';

const HotelsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchInfo, setSearchInfo] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noHotelsMessage, setNoHotelsMessage] = useState('');

  // Sample hotels data
  const sampleHotels = [
    {
      id: 1,
      name: "Luxury Hotel",
      location: "Pune, India",
      rating: 4.8,
      price: 299,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 2,
      name: "Seaside Resort",
      location: "Delhi, India",
      rating: 4.6,
      price: 199,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 3,
      name: "Mountain View Lodge",
      location: "Shimla, India",
      rating: 4.7,
      price: 149,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 4,
      name: "Urban Boutique Hotel",
      location: "Goa, India",
      rating: 4.5,
      price: 259,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 5,
      name: "Historic Inn",
      location: "Rajasthan, India",
      rating: 4.4,
      price: 189,
      image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 6,
      name: "Bayside Hotel",
      location: "Goa, India",
      rating: 4.9,
      price: 299,
      image: "https://images.unsplash.com/photo-1519449556851-5720b33024e7?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 7,
      name: "Eiffel Tower Suites",
      location: "Paris, France",
      rating: 4.9,
      price: 349,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 8,
      name: "Beachfront Villa",
      location: "Maldives",
      rating: 5.0,
      price: 599,
      image: "https://images.unsplash.com/photo-1579546929662-711aa81148cf?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 9,
      name: "Riviera Resort",
      location: "Cancun, Mexico",
      rating: 4.7,
      price: 249,
      image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 10,
      name: "Ski Lodge",
      location: "Zermatt, Switzerland",
      rating: 4.8,
      price: 399,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 11,
      name: "Desert Oasis",
      location: "Dubai, UAE",
      rating: 4.6,
      price: 449,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 12,
      name: "Historic Palace",
      location: "Rome, Italy",
      rating: 4.9,
      price: 329,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 13,
      name: "Tropical Hideaway",
      location: "Bali, Indonesia",
      rating: 4.8,
      price: 279,
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 14,
      name: "Mountain Retreat",
      location: "Tokyo, Japan",
      rating: 4.7,
      price: 319,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 15,
      name: "Safari Lodge",
      location: "Serengeti, Tanzania",
      rating: 4.5,
      price: 499,
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 16,
      name: "Beachfront Paradise",
      location: "Phuket, Thailand",
      rating: 4.8,
      price: 299,
      image: "https://images.unsplash.com/photo-1571506762511-39b330194a79?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 17,
      name: "Historic Manor",
      location: "London, UK",
      rating: 4.9,
      price: 379,
      image: "https://images.unsplash.com/photo-1551446591-142875a901a1?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 18,
      name: "Desert Resort",
      location: "Marrakech, Morocco",
      rating: 4.7,
      price: 349,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 19,
      name: "Mountain Chalet",
      location: "Zermatt, Switzerland",
      rating: 4.8,
      price: 429,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 20,
      name: "Beachfront Estate",
      location: "Santorini, Greece",
      rating: 4.9,
      price: 499,
      image: "https://images.unsplash.com/photo-1558981600-ec8c7bafb6d5?auto=format&fit=crop&w=800&q=60"
    },
    {
      id: 21,
      name: "Desert Palace",
      location: "Dubai, UAE",
      rating: 4.7,
      price: 549,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=60"
    }
  ];


  useEffect(() => {
    const location = searchParams.get('location') || '';
    const checkIn = searchParams.get('checkIn') || '';
    const checkOut = searchParams.get('checkOut') || '';
    const guests = searchParams.get('guests') || 2;

    setSearchInfo({ location, checkIn, checkOut, guests });

    // Filter hotels by location
    const filteredHotels = sampleHotels.filter(hotel =>
      hotel.location.toLowerCase().includes(location.toLowerCase())
    );

    if (filteredHotels.length === 0 && location) {
      setNoHotelsMessage(`No hotels are currently available in ${location}.`);
    } else {
      setNoHotelsMessage('');
    }

    setHotels(filteredHotels);
  }, [searchParams]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="hotels-page">
      <Header />

      <div className="hotels-container">
        <div className="search-summary">
          <h1>Hotels in {searchInfo.location || 'All Destinations'}</h1>
          {noHotelsMessage && (
            <div className="no-hotels-message">
              <p>{noHotelsMessage}</p>
            </div>
          )}
          {searchInfo.checkIn && searchInfo.checkOut && (
            <p>
              {formatDate(searchInfo.checkIn)} - {formatDate(searchInfo.checkOut)} · {searchInfo.guests} {parseInt(searchInfo.guests) === 1 ? 'Guest' : 'Guests'}
            </p>
          )}
        </div>

        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <Link to={`/booking/${hotel.id}`}>
                <div className="hotel-image" style={{ backgroundImage: `url(${hotel.image})`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer' }}>
                  <div className="hotel-rating">
                    <span>{hotel.rating}</span>
                  </div>
                </div>
              </Link>
              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p className="hotel-location">{hotel.location}</p>
                <div className="hotel-price">
                  <span className="price">₹{hotel.price}</span>
                  <span className="per-night">per night</span>
                </div>
                <Link to={`/booking/${hotel.id}`} className="view-deal-btn">View Deal</Link>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .no-hotels-message {
            margin: 20px 0;
            padding: 15px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .no-hotels-message p {
            color: #666;
            margin: 0;
            font-size: 16px;
          }
          .hotels-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem;
          }
          .hotel-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }
          .hotel-card:hover {
            transform: translateY(-5px);
          }
          .hotel-image {
            width: 100%;
            height: 200px;
            position: relative;
          }
          .hotel-rating {
            position: absolute;
            bottom: 15px;
            right: 15px;
            background: rgba(255, 255, 255, 0.9);
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 14px;
            color: #f1c40f;
          }
          .hotel-info {
            padding: 1.5rem;
          }
          .hotel-info h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.2rem;
          }
          .hotel-location {
            color: #666;
            margin: 0.5rem 0;
          }
          .hotel-price {
            display: flex;
            align-items: baseline;
            margin: 0.5rem 0;
          }
          .price {
            font-size: 1.2rem;
            font-weight: bold;
            color: #2ecc71;
          }
          .per-night {
            margin-left: 5px;
            color: #666;
            font-size: 0.9rem;
          }
          .view-deal-btn {
            display: inline-block;
            padding: 8px 16px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: background-color 0.3s ease;
          }
          .view-deal-btn:hover {
            background-color: #2980b9;
          }
        `}</style>
      </div>
    </div>
  );
};

export default HotelsPage;
