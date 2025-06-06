import React, { useState, useEffect, useRef } from 'react';
import HotelToolbar from '../components/HotelToolbar';
import HotelIntroSection from '../components/HotelIntroSection';

// Cập nhật API endpoint với port 3000
const API_BASE_URL = 'http://localhost:3000/api';
const IMAGE_URL = 'http://localhost:3000/api/images';

const HotelSearchPage = () => {
  const [searchData, setSearchData] = useState({
    checkIn: '',
    checkOut: '',
    numAdult: 1,
    numChild: 0,
    roomTypeId: ''
  });
  const [searchResults, setSearchResults] = useState(null);
  const [homeData, setHomeData] = useState({ services: [], roomTypes: [] });
  const [roomImages, setRoomImages] = useState({}); // Store room images
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const roomsRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Add Intersection Observer for room animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.room-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (roomsRef.current) {
      observer.observe(roomsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Fetch room type images
  const fetchRoomTypeImages = async (roomTypeId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/room-types/${roomTypeId}/images`);
      if (!response.ok) {
        throw new Error('Failed to fetch room images');
      }
      const data = await response.json();
      return data.data || [];
    } catch (err) {
      console.error(`Error fetching images for room ${roomTypeId}:`, err);
      return [];
    }
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch services
      console.log('Fetching services...');
      const servicesResponse = await fetch(`${API_BASE_URL}/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!servicesResponse.ok) {
        throw new Error(`Lỗi API Services (${servicesResponse.status})`);
      }
      const servicesResult = await servicesResponse.json();
      
      // Fetch room types with correct endpoint
      console.log('Fetching room types...');
      const roomTypesResponse = await fetch(`${API_BASE_URL}/room-types`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!roomTypesResponse.ok) {
        throw new Error(`Lỗi API Room Types (${roomTypesResponse.status})`);
      }
      
      const roomTypesResult = await roomTypesResponse.json();
      console.log('Room types data:', roomTypesResult);

      // Set initial data with fallback for empty arrays
      const roomTypes = roomTypesResult.data || [];
      if (roomTypes.length === 0) {
        console.log('No room types returned from API, using fallback data');
        roomTypes.push({
          _id: '1',
          name: 'Phòng Deluxe',
          pricePerNight: 1300000,
          maxAdult: 2,
          maxChild: 1,
          description: 'Phòng sang trọng với tầm nhìn ra thành phố',
          amenities: ['Bữa sáng miễn phí', 'WiFi', 'Máy lạnh'],
          imageIds: ['default-room-image']
        });
      }

      setHomeData({
        services: servicesResult.data || [],
        roomTypes: roomTypes
      });

      // Fetch images for each room type
      console.log('Fetching room images...');
      const imagesMap = {};
      for (const room of roomTypes) {
        try {
          const images = await fetchRoomTypeImages(room._id);
          imagesMap[room._id] = images;
          console.log(`Images for room ${room._id}:`, images);
        } catch (err) {
          console.error(`Error fetching images for room ${room._id}:`, err);
          imagesMap[room._id] = [{
            path: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500'
          }];
        }
      }
      setRoomImages(imagesMap);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (!searchData.checkIn || !searchData.checkOut) {
      alert('Vui lòng chọn ngày nhận và trả phòng');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams({
        checkIn: searchData.checkIn,
        checkOut: searchData.checkOut,
        numAdult: searchData.numAdult,
        numChild: searchData.numChild
      });

      console.log('Searching rooms with params:', searchParams.toString());
      const response = await fetch(`${API_BASE_URL}/rooms/available?${searchParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lỗi API (${response.status}): ${errorText}`);
      }
      
      const searchResults = await response.json();
      console.log('Search results:', searchResults);
      setSearchResults(searchResults);
    } catch (err) {
      console.error('Search error:', err);
      setError(`Không thể tìm kiếm phòng: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateNights = () => {
    if (!searchData.checkIn || !searchData.checkOut) return 0;
    const checkIn = new Date(searchData.checkIn);
    const checkOut = new Date(searchData.checkOut);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div style={styles.container}>
      
      {/* Loading Indicator */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <div style={styles.loadingSpinner}></div>
            <p style={{ marginTop: '1rem' }}>Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          textAlign: 'center',
          margin: '1rem'
        }}>
          <p>{error}</p>
          <button 
            onClick={fetchInitialData}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Only render content when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Hero Search Section */}
          <div style={styles.heroSection}>
            <div style={styles.heroOverlay}></div>
            <div style={styles.heroContent}>
              <h1 style={styles.heroTitle}>
                Phòng nghỉ dưỡng
              </h1>
              <p style={styles.heroSubtitle}>
                Phòng, suite, penthouse và biệt thự sang trọng
              </p>
              
              {/* Search Form */}
              <div style={styles.searchForm}>
                <div style={styles.searchRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Nhận phòng</label>
                    <input
                      type="date"
                      name="checkIn"
                      value={searchData.checkIn}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Trả phòng</label>
                    <input
                      type="date"
                      name="checkOut"
                      value={searchData.checkOut}
                      onChange={handleInputChange}
                      style={styles.input}
                    />
                  </div>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Số phòng</label>
                    <select style={styles.select}>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                    </select>
                  </div>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Người lớn</label>
                    <select
                      name="numAdult"
                      value={searchData.numAdult}
                      onChange={handleInputChange}
                      style={styles.select}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Trẻ em</label>
                    <select
                      name="numChild"
                      value={searchData.numChild}
                      onChange={handleInputChange}
                      style={styles.select}
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    style={loading ? {...styles.searchButton, ...styles.buttonDisabled} : styles.searchButton}
                  >
                    {loading ? (
                      <>
                        <span style={styles.spinner}></span>
                        Đang tìm...
                      </>
                    ) : 'TÌM KIẾM'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Intro Section */}
          {!hasSearched && <HotelIntroSection />}

          {/* Search Results */}
          {hasSearched && (
            <div style={styles.resultsSection}>
              <div style={styles.container}>
                {loading ? (
                  <div style={styles.loadingContainer}>
                    <div style={styles.loadingSpinner}></div>
                    <p>Đang tìm kiếm phòng trống...</p>
                  </div>
                ) : searchResults ? (
                  <div>
                    <div style={styles.resultsHeader}>
                      <h2 style={styles.resultsTitle}>
                        Kết quả tìm kiếm ({searchResults.totalAvailableRooms} phòng trống)
                      </h2>
                      <p style={styles.resultsInfo}>
                        {new Date(searchResults.checkIn).toLocaleDateString('vi-VN')} - {new Date(searchResults.checkOut).toLocaleDateString('vi-VN')} 
                        ({calculateNights()} đêm) • {searchData.numAdult} người lớn {searchData.numChild > 0 && `• ${searchData.numChild} trẻ em`}
                      </p>
                    </div>
                    
                    <div style={styles.roomGrid}>
                      {searchResults.roomTypes.map(roomType => (
                        <div key={roomType._id} style={styles.roomCard}>
                          <div style={styles.roomImageContainer}>
                            <img
                              src={roomType.imageIds[0]}
                              alt={roomType.name}
                              style={styles.roomImage}
                            />
                            <div style={styles.roomBadge}>
                              {roomType.availableRooms.length} phòng trống
                            </div>
                          </div>
                          
                          <div style={styles.roomContent}>
                            <div style={styles.roomHeader}>
                              <h3 style={styles.roomName}>{roomType.name}</h3>
                              <div style={styles.roomCapacity}>
                                👥 Tối đa {roomType.maxAdult} người lớn, {roomType.maxChild} trẻ em
                              </div>
                            </div>
                            
                            <p style={styles.roomDescription}>{roomType.description}</p>
                            
                            <div style={styles.amenities}>
                              {roomType.amenities.slice(0, 3).map((amenity, index) => (
                                <span key={index} style={styles.amenityTag}>
                                  ✓ {amenity}
                                </span>
                              ))}
                            </div>
                            
                            <div style={styles.roomFooter}>
                              <div style={styles.priceSection}>
                                <div style={styles.pricePerNight}>
                                  {formatPrice(roomType.pricePerNight)}/đêm
                                </div>
                                <div style={styles.totalPrice}>
                                  Tổng: {formatPrice(roomType.pricePerNight * calculateNights())}
                                </div>
                              </div>
                              
                              <button style={styles.bookButton}>
                                Đặt ngay
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Services Section */}
          {!hasSearched && homeData.services.length > 0 && (
            <div style={styles.contentSection}>
              <div style={styles.servicesSection}>
                <h2 style={styles.sectionTitle}>Khám phá dịch vụ của chúng tôi</h2>
                
                <div style={styles.servicesGrid}>
                  {homeData.services.map(service => (
                    <div key={service._id} style={styles.serviceCard}>
                      <div style={styles.serviceImageContainer}>
                        <img
                          src={service.imageId?.path || 'https://via.placeholder.com/600x400'}
                          alt={service.name}
                          style={styles.serviceImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/600x400';
                          }}
                        />
                        <div style={styles.serviceOverlay}>
                          <div style={styles.serviceContent}>
                            <h3 style={styles.serviceTitle}>{service.name}</h3>
                            <p style={styles.serviceDescription}>{service.description}</p>
                            <p style={{
                              ...styles.servicePrice,
                              fontSize: '1.2rem',
                              fontWeight: '600',
                              color: '#fff',
                              marginBottom: '1rem'
                            }}>
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                              }).format(service.price)}
                            </p>
                            <button style={styles.serviceButton}>Đặt ngay</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Types Section */}
              <div ref={roomsRef} style={styles.roomTypesSection}>
                <h2 style={styles.sectionTitle}>Các loại phòng</h2>
                {homeData.roomTypes.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '2rem'}}>
                    Không có dữ liệu phòng
                  </div>
                ) : (
                  <div style={styles.roomTypesGrid}>
                    {homeData.roomTypes.map((roomType) => (
                      <div
                        key={roomType._id}
                        className="room-card"
                        style={{
                          ...styles.roomTypeCard,
                          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                          opacity: 0,
                          transform: 'translateY(50px)',
                        }}
                      >
                        <div style={styles.roomTypeImageContainer}>
                          <img
                            src={roomImages[roomType._id]?.[0]?.path || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500'}
                            alt={roomType.name}
                            style={styles.roomTypeImage}
                            onError={(e) => {
                              console.log('Image load error for room:', roomType._id);
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500';
                            }}
                          />
                        </div>
                        <div style={styles.roomTypeContent}>
                          <h3 style={styles.roomTypeName}>{roomType.name}</h3>
                          <p style={styles.roomTypeDescription}>{roomType.description}</p>
                          <div style={styles.roomTypePrice}>
                            {formatPrice(roomType.pricePerNight)}/đêm
                          </div>
                          <div style={styles.roomTypeCapacity}>
                            👥 {roomType.maxAdult} người lớn • {roomType.maxChild} trẻ em
                          </div>
                          <div style={styles.roomTypeAmenities}>
                            {roomType.amenities?.map((amenity, i) => (
                              <span key={i} style={styles.amenityTag}>✓ {amenity}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    },
    heroSection: {
      position: 'relative',
      height: '100vh',
      minHeight: '100vh',
      backgroundImage: 'url("https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%)'
    },
    heroContent: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      color: 'white',
      maxWidth: '1200px',
      width: '100%',
      padding: '0 2rem'
    },
    heroTitle: {
      fontSize: '3rem',
      fontWeight: '700',
      marginBottom: '1rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      marginBottom: '3rem',
      opacity: 0.9,
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    },
    searchForm: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    },
    searchRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem',
      alignItems: 'end'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff'
    },
    select: {
      padding: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s ease',
      backgroundColor: '#ffffff',
      cursor: 'pointer'
    },
    searchButton: {
      padding: '0.75rem 2rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      minHeight: '48px'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid #ffffff',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    },
    resultsSection: {
      padding: '3rem 2rem'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '3rem'
    },
    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #e2e8f0',
      borderTopColor: '#3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem'
    },
    resultsHeader: {
      marginBottom: '2rem'
    },
    resultsTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    resultsInfo: {
      color: '#6b7280',
      fontSize: '1rem'
    },
    roomGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '2rem'
    },
    roomCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.4s ease',
      cursor: 'pointer'
    },
    roomImageContainer: {
      position: 'relative',
      height: '240px',
      overflow: 'hidden'
    },
    roomImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.6s ease'
    },
    roomBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: '#059669',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.875rem',
      fontWeight: '600'
    },
    roomContent: {
      padding: '1.5rem'
    },
    roomHeader: {
      marginBottom: '1rem'
    },
    roomName: {
      fontSize: '1.5rem',
      fontWeight: '700',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    roomCapacity: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    roomDescription: {
      color: '#4b5563',
      lineHeight: '1.6',
      marginBottom: '1rem'
    },
    amenities: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginBottom: '1.5rem'
    },
    amenityTag: {
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      padding: '0.4rem 0.8rem',
      borderRadius: '6px',
      fontSize: '0.85rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    roomFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    priceSection: {
      textAlign: 'left'
    },
    pricePerNight: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#1f2937'
    },
    totalPrice: {
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    bookButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    contentSection: {
      padding: '4rem 2rem'
    },
    servicesSection: {
      marginBottom: '4rem'
    },
    sectionTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: '3rem'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    serviceCard: {
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      transition: 'all 0.5s ease',
      height: '400px'
    },
    serviceImageContainer: {
      position: 'relative',
      height: '100%',
      overflow: 'hidden'
    },
    serviceImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.6s ease'
    },
    serviceOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      padding: '2rem',
      transition: 'all 0.3s ease'
    },
    serviceContent: {
      color: 'white',
      textAlign: 'center',
      maxWidth: '100%'
    },
    serviceTitle: {
      fontSize: '1.75rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)'
    },
    serviceDescription: {
      fontSize: '1rem',
      marginBottom: '1rem',
      opacity: 0.9,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textShadow: '0 1px 2px rgba(0,0,0,0.3)'
    },
  servicePrice: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '1rem'
  },
  serviceButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '2px solid white',
    padding: '0.75rem 2rem',
    borderRadius: '25px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)'
  },roomTypesSection: {
    marginTop: '4rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  
  roomTypesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    width: '100%',
    padding: '1rem'
  },
  
  roomTypeCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid #eee',
    minHeight: '450px',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)'
    }
  },
  
  roomTypeImageContainer: {
    width: '100%',
    height: '250px',
    overflow: 'hidden',
    position: 'relative'
  },
  
  roomTypeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease'
  },
  
  roomTypeContent: {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  
  roomTypeName: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '0.5rem'
  },
  
  roomTypeDescription: {
    fontSize: '0.95rem',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '1rem'
  },
  
  roomTypePrice: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: '0.5rem'
  },
  
  roomTypeCapacity: {
    fontSize: '0.9rem',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  
  roomTypeAmenities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: 'auto'
  },
};

// Update the styleSheet content
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .room-card {
    animation: fadeInUp 0.6s ease forwards;
  }

  .room-card:hover img {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    .roomTypesGrid {
      grid-template-columns: 1fr !important;
      padding: 1rem;
    }
    
    .roomTypeCard {
      margin: 0 auto;
      max-width: 400px;
    }
  }
`;
document.head.appendChild(styleSheet);

export default HotelSearchPage;