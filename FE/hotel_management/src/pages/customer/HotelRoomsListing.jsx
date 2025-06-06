import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const HotelRoomsListing = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [imageMap, setImageMap] = useState({});

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
      setImageMap(map);
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

  const filterOptions = [
    { key: 'all', label: 'Tất Cả Phòng', count: rooms.reduce((sum, room) => sum + (room.roomCount || 1), 0) },
    ...Array.from(new Set(rooms.map(room => room.type))).map(type => {
      const roomsOfType = rooms.filter(r => r.type === type);
      return {
        key: type,
        label: roomsOfType[0]?.name || type,
        count: roomsOfType.reduce((sum, room) => sum + (room.roomCount || 1), 0)
      };
    })
  ];

  console.log('Current filter options:', filterOptions);

  const filteredRooms = rooms.filter(room => {
    const matchesFilter = selectedFilter === 'all' || room.type === selectedFilter;
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  console.log('Filtered rooms:', filteredRooms);

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          color: 'white',
          fontSize: '1.2rem',
          textAlign: 'center'
        }}>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          color: 'white',
          fontSize: '1.2rem',
          textAlign: 'center'
        }}>
          {error}
          <button
            onClick={fetchRoomTypes}
            style={{
              marginTop: '1rem',
              padding: '0.8rem 1.5rem',
              backgroundColor: 'white',
              color: '#3b82f6',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '2rem',
          transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s ease'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '300',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Danh Sách Phòng
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Khám phá các loại phòng cao cấp tại Khách Sạn ABCD
          </p>
        </div>

        {/* Search and Filter */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          {/* Search */}
          <div style={{
            position: 'relative',
            minWidth: '300px'
          }}>
            <input
              type="text"
              placeholder="Tìm kiếm phòng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1rem',
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            {filterOptions.map(option => (
              <button
                key={option.key}
                onClick={() => setSelectedFilter(option.key)}
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '25px',
                  border: 'none',
                  backgroundColor: selectedFilter === option.key 
                    ? 'rgba(255,255,255,0.95)' 
                    : 'rgba(255,255,255,0.2)',
                  color: selectedFilter === option.key ? '#333' : 'white',
                  fontWeight: selectedFilter === option.key ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  boxShadow: selectedFilter === option.key 
                    ? '0 4px 20px rgba(0,0,0,0.1)' 
                    : 'none'
                }}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem'
        }}>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <div
                key={room.id}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                {/* Room content */}
                <div style={{
                  height: '250px',
                  backgroundColor: '#f5f5f5',
                  backgroundImage: room.images && room.images.length > 0 ? 
                    `url(${room.images[0]})` :
                    'url(https://plus.unsplash.com/premium_photo-1678297269904-6c46528b36a1?q=80&w=1470&auto=format&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    color: 'white'
                  }}>
                    <div style={{fontSize: '0.9rem'}}>
                      {room.capacity.adult} người lớn, {room.capacity.child} trẻ em
                    </div>
                  </div>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    {room.name}
                  </h3>
                  
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: '#3b82f6',
                    marginBottom: '1rem'
                  }}>
                    {new Intl.NumberFormat('vi-VN').format(room.price)}đ/đêm
                  </div>

                  <p style={{
                    color: '#666',
                    marginBottom: '1.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5'
                  }}>
                    {room.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '1.5rem'
                  }}>
                    <button style={{
                      flex: 1,
                      padding: '0.8rem 1rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}>
                      Đặt Phòng
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowModal(true);
                      }}
                      style={{
                        padding: '0.8rem 1.2rem',
                        backgroundColor: '#f8fafc',
                        color: '#3b82f6',
                        border: '2px solid #3b82f6',
                        borderRadius: '10px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: '120px',
                        textAlign: 'center'
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
              color: 'white',
              padding: '2rem'
            }}>
              Không tìm thấy phòng nào phù hợp với tiêu chí tìm kiếm
            </div>
          )}
        </div>
      </div>

      {/* Room Details Modal */}
      {showModal && selectedRoom && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            maxWidth: '1000px',
            width: '95%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            animation: 'modalFadeIn 0.3s ease'
          }}>
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                zIndex: 1001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
              }}
            >
              ×
            </button>

            {/* Image Gallery */}
            <div style={{
              height: '400px',
              backgroundImage: selectedRoom.images[0] ? 
                `url(${selectedRoom.images[0]})` :
                'url(https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '20px 20px 0 0',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '2rem',
                color: 'white'
              }}>
                <h2 style={{
                  fontSize: '2.5rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  {selectedRoom.name}
                </h2>
                <div style={{
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>👥</span>
                    <span>{selectedRoom.capacity.adult} người lớn, {selectedRoom.capacity.child} trẻ em</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>💰</span>
                    <span>{formatPrice(selectedRoom.price)}đ/đêm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '2rem' }}>
              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '1rem'
                }}>
                  Mô tả
                </h3>
                <p style={{
                  color: '#666',
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}>
                  {selectedRoom.description}
                </p>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#333',
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
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        color: '#333'
                      }}
                    >
                      <span style={{ color: '#3b82f6', fontSize: '1.2rem' }}>✓</span>
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
                    color: '#333',
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
                          backgroundColor: '#f8fafc',
                          borderRadius: '10px',
                          color: '#333'
                        }}
                      >
                        <span style={{ color: '#3b82f6', fontSize: '1.2rem' }}>
                          {facility.icon === 'air-conditioner' ? '❄️' : '✓'}
                        </span>
                        <div>
                          <div style={{ fontWeight: '500' }}>{facility.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>{facility.description}</div>
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
                borderTop: '1px solid #e5e7eb',
                paddingTop: '2rem'
              }}>
                <button style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <span>🏨</span>
                  Đặt phòng ngay
                </button>
                <button 
                  onClick={closeModal}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '150px'
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelRoomsListing;

// Add keyframe animation for modal
const style = document.createElement('style');
style.textContent = `
  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);