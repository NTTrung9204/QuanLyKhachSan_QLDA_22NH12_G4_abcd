import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const HotelRoomsListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  // Scroll effect for background parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    fetchRoomTypes();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/images`);
      const images = response.data.data;
      const map = {};
      images.forEach(img => {
        map[img._id] = img.path;
      });
      return map;
    } catch (err) {
      console.error('Error fetching images:', err);
      return {};
    }
  };

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching room types...');
      const [roomResponse, imageMap] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/room-types`),
        fetchImages()
      ]);

      console.log('Raw API response:', roomResponse.data);

      if (!roomResponse.data.data || !Array.isArray(roomResponse.data.data)) {
        throw new Error('Invalid data format from API');
      }

      const roomsData = roomResponse.data.data.map(type => ({
        id: type._id,
        name: type.name,
        type: type.name.toLowerCase().replace(' ', '_'),
        capacity: {
          adult: type.maxAdult,
          child: type.maxChild
        },
        price: type.pricePerNight,
        description: type.description,
        amenities: type.amenities || [],
        facilities: type.facilityIds || [],
        images: type.imageIds ? type.imageIds.map(id => imageMap[id] || '') : [],
        roomCount: type.roomCount || 0
      }));

      console.log('Processed rooms data:', roomsData);
      setRooms(roomsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching room types:', err);
      setError('Không thể tải danh sách loại phòng. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%),
          url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        padding: '4rem 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            textAlign: 'center',
            color: 'white',
            marginBottom: '4rem'
          }}>
            <div style={{
              fontSize: '4rem',
              fontWeight: '100',
              marginBottom: '1rem',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              animation: 'fadeInUp 1s ease'
            }}>
              Đang tải phòng...
            </div>
            <div style={{
              fontSize: '2.5rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              ✨
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem'
          }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '24px',
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.2)',
                animation: 'shimmer 2s infinite'
              }}>
                <div style={{
                  height: '300px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shimmerWave 2s infinite'
                }} />
                <div style={{ padding: '2rem' }}>
                  <div style={{
                    height: '28px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }} />
                  <div style={{
                    height: '20px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    width: '60%'
                  }} />
                  <div style={{
                    height: '80px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          @keyframes shimmerWave {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%),
          url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '1.5rem',
          textAlign: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
          padding: '3rem',
          borderRadius: '20px',
          backdropFilter: 'blur(20px)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
          {error}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '2rem',
              padding: '1rem 2rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.85) 100%),
        url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Floating background elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.1,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
        `
      }} />

      {/* Header Section */}
      <div style={{
        padding: '6rem 2rem 4rem',
        textAlign: 'center',
        transform: `translateY(${scrollY * 0.3}px)`
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          transform: isVisible ? 'translateY(0)' : 'translateY(-50px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '100',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 8px 32px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em'
          }}>
            Danh Sách Phòng
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Khám phá các loại phòng sang trọng với tiện nghi đẳng cấp quốc tế
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto 2rem',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Tìm kiếm phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1.2rem 2rem',
                borderRadius: '60px',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '1.1rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem 6rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '3rem'
        }}>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.9)',
                  opacity: isVisible ? 1 : 0,
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setHoveredCard(room.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Room Image */}
                <div style={{
                  height: '320px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: room.images && room.images.length > 0 ? 
                      `url(${room.images[0]})` :
                      'url(https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.6s ease',
                    transform: hoveredCard === room.id ? 'scale(1.1)' : 'scale(1)'
                  }} />
                  
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                  }} />
                  
                  {/* Price badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '20px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    {formatPrice(room.price)}đ/đêm
                  </div>
                </div>
                
                {/* Content */}
                <div style={{ padding: '2rem' }}>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '600',
                    marginBottom: '1rem',
                    color: 'white',
                    letterSpacing: '-0.01em'
                  }}>
                    {room.name}
                  </h3>

                  <div style={{
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>👥</span>
                    <span>{room.capacity.adult} người lớn, {room.capacity.child} trẻ em</span>
                  </div>

                  <p style={{
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '2rem',
                    lineHeight: '1.7',
                    fontSize: '1rem'
                  }}>
                    {room.description}
                  </p>

                  {/* Action buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem'
                  }}>
                    <button style={{
                      flex: 1,
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem',
                      letterSpacing: '0.5px'
                    }}>
                      Đặt phòng
                    </button>
                    
                    <button 
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowModal(true);
                      }}
                      style={{
                        padding: '1rem 1.5rem',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        fontSize: '1rem'
                      }}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.8)',
              padding: '4rem',
              fontSize: '1.2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              Không tìm thấy phòng phù hợp
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRoom && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            borderRadius: '28px',
            maxWidth: '900px',
            width: '95%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            animation: 'modalSlideIn 0.4s ease'
          }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 0.3s ease'
              }}
            >
              ×
            </button>

            <div style={{
              height: '400px',
              backgroundImage: selectedRoom.images && selectedRoom.images.length > 0 ? 
                `url(${selectedRoom.images[0]})` :
                'url(https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '28px 28px 0 0',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '50%',
                background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.8))'
              }} />
            </div>

            <div style={{ padding: '3rem' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: 'white',
                letterSpacing: '-0.02em'
              }}>
                {selectedRoom.name}
              </h2>

              <div style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                color: '#60a5fa',
                marginBottom: '2rem'
              }}>
                {formatPrice(selectedRoom.price)}đ/đêm
              </div>

              <p style={{
                color: 'rgba(255,255,255,0.9)',
                lineHeight: '1.8',
                marginBottom: '3rem',
                fontSize: '1.1rem'
              }}>
                {selectedRoom.description}
              </p>

              {/* Amenities */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '1rem'
                }}>
                  Tiện ích đi kèm
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1rem'
                }}>
                  {selectedRoom.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        color: 'white'
                      }}
                    >
                      <span style={{ color: '#60a5fa', fontSize: '1.2rem' }}>✓</span>
                      <span style={{ fontSize: '1rem' }}>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              {selectedRoom.facilities.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem'
                  }}>
                    Tiện nghi phòng
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    {selectedRoom.facilities.map((facility) => (
                      <div
                        key={facility._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '1rem',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          color: 'white'
                        }}
                      >
                        <span style={{ color: '#60a5fa', fontSize: '1.2rem' }}>
                          {facility.icon === 'air-conditioner' ? '❄️' : '✓'}
                        </span>
                        <div>
                          <div style={{ fontWeight: '500' }}>{facility.name}</div>
                          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                            {facility.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                marginTop: '2rem',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                paddingTop: '2rem'
              }}>
                <button style={{
                  flex: 1,
                  padding: '1.2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  Đặt phòng ngay
                </button>
                <button 
                  onClick={closeModal}
                  style={{
                    padding: '1.2rem 2rem',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '16px',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalSlideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HotelRoomsListing;