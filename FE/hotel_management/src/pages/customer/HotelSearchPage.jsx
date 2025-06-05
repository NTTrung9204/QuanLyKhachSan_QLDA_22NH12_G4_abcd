import React, { useState, useEffect } from 'react';

const HotelSearchPage = () => {
  const [searchData, setSearchData] = useState({
    checkIn: '',
    checkOut: '',
    numRooms: 1,
    numAdult: 2,
    numChild: 0,
    roomTypeId: ''
  });
  const [searchResults, setSearchResults] = useState(null);
  const [homeData, setHomeData] = useState({ services: [], roomTypes: [] });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock data
  useEffect(() => {
    const mockHomeData = {
      services: [
        {
          _id: '1',
          name: 'Spa & Massage',
          description: 'Dịch vụ spa và massage thư giãn cao cấp',
          price: 350000,
          imageId: { path: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400' }
        },
        {
          _id: '2',
          name: 'Nhà hàng',
          description: 'Ẩm thực đặc sắc từ khắp nơi trên thế giới',
          price: 500000,
          imageId: { path: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' }
        }
      ],
      roomTypes: [
        {
          _id: '1',
          name: 'Phòng Deluxe',
          pricePerNight: 1300000,
          maxAdult: 2,
          maxChild: 1,
          description: 'Phòng sang trọng với tầm nhìn ra thành phố, diện tích 30m²',
          amenities: ['Bữa sáng miễn phí', 'Dịch vụ phòng 24/7', 'Đồ dùng phòng tắm cao cấp'],
          imageIds: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500']
        },
        {
          _id: '2',
          name: 'Phòng Suite',
          pricePerNight: 2500000,
          maxAdult: 4,
          maxChild: 2,
          description: 'Suite cao cấp với phòng khách riêng biệt, diện tích 60m²',
          amenities: ['Phòng khách riêng', 'Minibar miễn phí', 'Butler service', 'Tầm nhìn ra biển'],
          imageIds: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500']
        },
        {
          _id: '3',
          name: 'Phòng Standard',
          pricePerNight: 800000,
          maxAdult: 2,
          maxChild: 1,
          description: 'Phòng tiêu chuẩn thoải mái với đầy đủ tiện nghi, diện tích 25m²',
          amenities: ['WiFi miễn phí', 'TV màn hình phẳng', 'Máy lạnh', 'Tủ lạnh mini'],
          imageIds: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500']
        }
      ]
    };
    setHomeData(mockHomeData);
  }, []);

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

    try {
      setTimeout(() => {
        const mockResults = {
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          totalAvailableRooms: homeData.roomTypes.reduce((acc, rt) => acc + (rt.name === 'Phòng Standard' ? 2 : (rt.name === 'Phòng Deluxe' ? 3 : 3)), 0), // Dynamic based on example
          roomTypes: homeData.roomTypes.map(roomType => ({
            ...roomType,
            availableRooms: [
              { _id: `${roomType._id}-101`, name: '101', floor: '1' },
              { _id: `${roomType._id}-102`, name: '102', floor: '1' },
              ...(roomType.name !== 'Phòng Standard' ? [{ _id: `${roomType._id}-201`, name: '201', floor: '2' }] : [])
            ].slice(0, Math.floor(Math.random() * 3) + 1) // Random available rooms per type
          })).filter(rt => rt.availableRooms.length > 0)
        };
        // Update totalAvailableRooms based on filtered results
        mockResults.totalAvailableRooms = mockResults.roomTypes.reduce((sum, rt) => sum + rt.availableRooms.length, 0);

        setSearchResults(mockResults);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Search error:', error);
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
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div style={styles.container}>
      {/* Hero Search Section with Luxury Hotel Room Background */}
      <div style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        
        {/* Brand/Logo */}
        <div style={styles.brandContainer}>
          <div style={styles.brandText}>DANANG SON TRA PENINSULA RESORT</div>
        </div>
        
        <div style={styles.heroContent}>
          <div style={styles.titleContainer}>
            <h1 style={styles.heroTitle}>Phòng nghỉ dưỡng</h1>
            <p style={styles.heroSubtitle}>Phòng, suite, penthouse và biệt thự sang trọng</p>
          </div>
          
          {/* Elegant Search Form */}
          <div style={styles.searchFormContainer}>
            <div style={styles.searchForm}>
              <div style={styles.searchRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nhận phòng</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={searchData.checkIn}
                    onChange={handleInputChange}
                    style={styles.dateInput}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  />
                  <div style={styles.dateDisplay} onClick={() => document.querySelector('input[name="checkIn"]').showPicker()}>
                    {searchData.checkIn ? formatDate(searchData.checkIn) : 'Chọn ngày'}
                  </div>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Trả phòng</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={searchData.checkOut}
                    onChange={handleInputChange}
                    style={styles.dateInput}
                    min={searchData.checkIn ? new Date(new Date(searchData.checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date(new Date().getTime() + 86400000).toISOString().split('T')[0]} // Min checkout is day after checkin
                  />
                  <div style={styles.dateDisplay} onClick={() => document.querySelector('input[name="checkOut"]').showPicker()}>
                    {searchData.checkOut ? formatDate(searchData.checkOut) : 'Chọn ngày'}
                  </div>
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Số phòng</label>
                  <select
                    name="numRooms"
                    value={searchData.numRooms}
                    onChange={handleInputChange}
                    style={styles.select}
                  >
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
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
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
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
                    {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                
                <button
                  onClick={handleSearch}
                  disabled={loading || !searchData.checkIn || !searchData.checkOut || new Date(searchData.checkOut) <= new Date(searchData.checkIn)}
                  style={loading || !searchData.checkIn || !searchData.checkOut || new Date(searchData.checkOut) <= new Date(searchData.checkIn) ? {...styles.searchButton, ...styles.buttonDisabled} : styles.searchButton}
                >
                  {loading ? (
                    <>
                      <span style={styles.spinner}></span>
                      Đang tìm...
                    </>
                  ) : 'TÌM KIẾM'}
                </button>
              </div>
               {searchData.checkIn && searchData.checkOut && new Date(searchData.checkOut) <= new Date(searchData.checkIn) && (
                <p style={styles.dateError}>Ngày trả phòng phải sau ngày nhận phòng.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div style={styles.resultsSection}>
          <div style={styles.containerInner}>
            {loading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Đang tìm kiếm phòng trống...</p>
              </div>
            ) : searchResults && searchResults.roomTypes && searchResults.roomTypes.length > 0 ? (
              <div>
                <div style={styles.resultsHeader}>
                  <h2 style={styles.resultsTitle}>
                    Kết quả tìm kiếm ({searchResults.totalAvailableRooms} phòng trống)
                  </h2>
                  <p style={styles.resultsInfo}>
                    {formatDate(searchResults.checkIn)} - {formatDate(searchResults.checkOut)}
                    ({calculateNights()} đêm) • {searchData.numAdult} người lớn {searchData.numChild > 0 && `• ${searchData.numChild} trẻ em`}
                  </p>
                </div>
                
                <div style={styles.roomGrid}>
                  {searchResults.roomTypes.map(roomType => (
                    <div key={roomType._id} style={styles.roomCard} onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                    }} onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                    }}>
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
                          {roomType.amenities.length > 3 && <span style={styles.amenityTag}>...</span>}
                        </div>
                        
                        <div style={styles.roomFooter}>
                          <div style={styles.priceSection}>
                            <div style={styles.pricePerNight}>
                              {formatPrice(roomType.pricePerNight)}/đêm
                            </div>
                            {calculateNights() > 0 && (
                               <div style={styles.totalPrice}>
                                Tổng {calculateNights()} đêm: {formatPrice(roomType.pricePerNight * calculateNights())}
                              </div>
                            )}
                          </div>
                          
                          <button style={styles.bookButton} onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#b8941f';
                            e.target.style.transform = 'scale(1.05)';
                          }} onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#d4af37';
                            e.target.style.transform = 'scale(1)';
                          }}>
                            Chọn phòng
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
                 <div style={styles.noResultsContainer}>
                    <h2 style={styles.resultsTitle}>Không tìm thấy phòng phù hợp</h2>
                    <p style={styles.resultsInfo}>
                        Vui lòng thử thay đổi ngày hoặc các tiêu chí tìm kiếm khác.
                    </p>
                    <button 
                        onClick={() => setHasSearched(false)} 
                        style={{...styles.searchButton, marginTop: '2rem', backgroundColor: '#333'}}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
                    >
                        Tìm kiếm lại
                    </button>
                 </div>
            )}
          </div>
        </div>
      )}

      {/* Services and Room Types Section */}
      {!hasSearched && (
        <div style={styles.contentSection}>
          <div style={styles.servicesSection}>
            <h2 style={styles.sectionTitle}>Khám phá dịch vụ của chúng tôi</h2>
            
            <div style={styles.servicesGrid}>
              <div style={styles.serviceCard} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
              }}>
                <div style={styles.serviceImageContainer}>
                  <img
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80"
                    alt="Experiences"
                    style={styles.serviceImage}
                  />
                  <div style={styles.serviceOverlay}>
                    <div style={styles.serviceContent}>
                      <h3 style={styles.serviceTitle}>Trải nghiệm tại chỗ</h3>
                      <p style={styles.serviceDescription}>Khám phá những hoạt động thú vị</p>
                      <button style={styles.serviceButton} onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#1f2937';
                      }} onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'white';
                      }}>Khám phá</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={styles.serviceCard} onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
                e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                 e.currentTarget.querySelector('img').style.transform = 'scale(1)';
              }}>
                <div style={styles.serviceImageContainer}>
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
                    alt="Online Experiences"
                    style={styles.serviceImage}
                  />
                  <div style={styles.serviceOverlay}>
                    <div style={styles.serviceContent}>
                      <h3 style={styles.serviceTitle}>Dịch vụ online</h3>
                      <p style={styles.serviceDescription}>Đặt dịch vụ từ xa tiện lợi</p>
                      <button style={styles.serviceButton} onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#1f2937';
                      }} onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'white';
                      }}>Trải nghiệm online</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Types Section */}
          <div style={styles.roomTypesSection}>
            <h2 style={styles.sectionTitle}>Các loại phòng</h2>
            <div style={styles.roomTypesGrid}>
              {homeData.roomTypes.map(roomType => (
                <div key={roomType._id} style={styles.roomTypeCard} onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.querySelector('img').style.transform = 'scale(1)';
                }}>
                  <div style={styles.roomTypeImageContainer}>
                    <img
                      src={roomType.imageIds[0]}
                      alt={roomType.name}
                      style={styles.roomTypeImage}
                    />
                  </div>
                  <div style={styles.roomTypeContent}>
                    <h3 style={styles.roomTypeName}>{roomType.name}</h3>
                    <p style={styles.roomTypeDescription}>{roomType.description}</p>
                    <div style={{marginTop: 'auto'}}> {/* Pushes price and capacity to bottom */}
                        <div style={styles.roomTypePrice}>
                        {formatPrice(roomType.pricePerNight)}/đêm
                        </div>
                        <div style={styles.roomTypeCapacity}>
                        👥 {roomType.maxAdult} người lớn • {roomType.maxChild} trẻ em
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif', // Changed to a more modern sans-serif font
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    color: '#333' // Default text color
  },
  heroSection: {
    position: 'relative',
    height: '100vh',
    minHeight: '700px',
    backgroundImage: 'url("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=1080&fit=crop&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '5rem' // Space for search form not to be cut off on smaller viewports
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 100%)', // Adjusted gradient
    backdropFilter: 'blur(1px)'
  },
  brandContainer: {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    zIndex: 3
  },
  brandText: {
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: '500', // Slightly bolder
    letterSpacing: '2px',
    textTransform: 'uppercase',
    opacity: 0.9
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
  titleContainer: {
    marginBottom: '3rem' // Reduced margin
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', // Responsive font size
    fontWeight: '700', // Bolder for Playfair
    marginBottom: '1rem',
    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
    letterSpacing: '1px',
    fontFamily: '"Playfair Display", serif'
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', // Responsive
    marginBottom: '0',
    opacity: 0.9,
    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
    fontWeight: '300',
    fontFamily: '"Inter", sans-serif', // Subtitle with sans-serif
    letterSpacing: '0.5px'
  },
  searchFormContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: '2rem' // Add some space from title
  },
  searchForm: {
    background: 'rgba(255, 255, 255, 0.98)', // Slightly less transparent
    borderRadius: '12px',
    padding: '1.5rem 2rem', // Adjusted padding
    boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    maxWidth: '1000px', // Slightly wider
    width: '100%'
  },
  searchRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', // More responsive columns
    gap: '1rem', // Adjusted gap
    alignItems: 'end'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  label: {
    fontSize: '0.75rem', // Smaller label
    fontWeight: '600', // Bolder label
    color: '#4a5568', // Darker gray
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  dateInput: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'all',
    width: '100%',
    height: 'calc(100% - 1.625rem)', // Adjust height to cover display part
    top: 'calc(0.5rem + 0.75rem)', // Label height + margin
    left: 0,
    zIndex: 1,
    cursor: 'pointer'
  },
  dateDisplay: {
    padding: '0.75rem 1rem', // Adjusted padding
    border: '1px solid #cbd5e1', // Softer border
    borderRadius: '8px',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left', // Align date text left
    fontWeight: '500',
    position: 'relative',
    zIndex: 0,
    minHeight: '42px', // Ensure consistent height
    display: 'flex',
    alignItems: 'center'
  },
  select: {
    padding: '0.75rem 1rem', // Adjusted padding
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    color: '#374151',
    fontWeight: '500',
    textAlign: 'left', // Align select text left
    minHeight: '42px',
    appearance: 'none', // Remove default arrow
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.7rem center',
    backgroundSize: '1em',
    paddingRight: '2.5rem' // Space for custom arrow
  },
  searchButton: {
    padding: '0.75rem 1.5rem', // Adjusted padding
    backgroundColor: '#d4af37', // Gold color
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    minHeight: '42px', // Consistent height
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
  },
  buttonDisabled: {
    backgroundColor: '#cbd5e1', // Lighter gray for disabled
    color: '#64748b',
    cursor: 'not-allowed',
    boxShadow: 'none'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid currentColor', // Use currentColor
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  dateError: {
    color: '#e53e3e', // Red for error
    fontSize: '0.75rem',
    marginTop: '0.5rem',
    textAlign: 'left',
    gridColumn: 'span 2' // Span across date fields
  },
  containerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem'
  },
  resultsSection: {
    padding: '4rem 0',
    backgroundColor: '#ffffff'
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingSpinner: {
    width: '48px', // Larger spinner
    height: '48px',
    border: '5px solid #e2e8f0',
    borderTopColor: '#d4af37',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1.5rem' // Increased margin
  },
  loadingText: { // Style for loading text
    fontSize: '1.125rem',
    color: '#4a5568'
  },
  resultsHeader: {
    marginBottom: '3rem',
    textAlign: 'center' // Center results header
  },
  resultsTitle: {
    fontSize: 'clamp(1.8rem, 4vw, 2.25rem)', // Responsive
    fontWeight: '700', // Bolder for Playfair
    color: '#1a202c', // Darker
    marginBottom: '0.75rem',
    fontFamily: '"Playfair Display", serif'
  },
  resultsInfo: {
    color: '#4a5568', // Slightly darker gray
    fontSize: '1rem'
  },
  roomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', // Adjusted minmax
    gap: '2.5rem' // Increased gap
  },
  roomCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)', // Softer shadow
    transition: 'all 0.3s ease-out', // Smoother transition
    cursor: 'pointer',
    display: 'flex', // Added for better internal layout control if needed
    flexDirection: 'column' // Ensures content flows downwards
  },
  roomImageContainer: {
    position: 'relative',
    height: '250px', // Consistent image height
    overflow: 'hidden' // Clip image zoom
  },
  roomImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease' // For zoom on hover
  },
  roomBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'rgba(212, 175, 55, 0.9)', // Gold with slight transparency
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  roomContent: {
    padding: '1.5rem', // Adjusted padding
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1 // Allows content to expand
  },
  roomHeader: {
    marginBottom: '1rem'
  },
  roomName: {
    fontSize: '1.5rem', // Slightly larger
    fontWeight: '600', // Bolder for Playfair
    color: '#2d3748',
    marginBottom: '0.5rem',
    fontFamily: '"Playfair Display", serif'
  },
  roomCapacity: {
    color: '#718096', // Softer gray
    fontSize: '0.875rem'
  },
  roomDescription: {
    color: '#4a5568',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    fontSize: '0.9rem', // Slightly smaller for balance
    flexGrow: 1 // Pushes footer down
  },
  amenities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem' // Adjusted margin
  },
  amenityTag: {
    backgroundColor: '#edf2f7', // Lighter background
    color: '#4a5568', // Darker text for contrast
    padding: '0.3rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  roomFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto' // Pushes footer to bottom of card content
  },
  priceSection: {
    textAlign: 'left'
  },
  pricePerNight: {
    fontSize: '1.375rem',
    fontWeight: '700', // Bolder price
    color: '#d4af37'
  },
  totalPrice: {
    fontSize: '0.875rem',
    color: '#718096', // Softer gray
    marginTop: '0.25rem'
  },
  bookButton: {
    backgroundColor: '#d4af37',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem', // Matched search button
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  noResultsContainer: { // Styles for no results message
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#f8fafc', // Light background
    borderRadius: '12px',
    // boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginTop: '2rem'
  },
  contentSection: {
    padding: '5rem 2rem',
    backgroundColor: '#ffffff' // Keep white or change to f8fafc for consistency
  },
  servicesSection: {
    marginBottom: '5rem',
    maxWidth: '1200px',
    margin: '0 auto 5rem auto' // Center section content
  },
  sectionTitle: {
    fontSize: 'clamp(2rem, 5vw, 2.5rem)', // Responsive
    fontWeight: '700', // Bolder Playfair
    color: '#1a202c', // Darker
    textAlign: 'center',
    marginBottom: '3rem',
    fontFamily: '"Playfair Display", serif'
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2.5rem'
  },
  serviceCard: {
    position: 'relative',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)', // Slightly softer shadow
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    height: '450px' // Increased height for better visual
  },
  serviceImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden' // Important for image zoom effect
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease-out' // Smooth zoom transition
  },
  serviceOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Slightly darker overlay for better text contrast
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '2.5rem', // Increased padding
    textAlign: 'center',
    transition: 'background-color 0.3s ease'
  },
  serviceContent: {
    color: 'white',
    transform: 'translateY(20px)', // Initial slight offset for animation
    opacity: 0, // Initial opacity for animation
    transition: 'transform 0.4s ease-out, opacity 0.4s ease-out'
    // Hover effect for this can be:
    // serviceCard:hover serviceContent: { transform: 'translateY(0)', opacity: 1 }
    // But since hover is on card, this needs JS or more complex CSS if only content animates.
    // For simplicity, the JSX handles overall card hover.
  },
  serviceTitle: {
    fontSize: '1.875rem', // Larger title
    fontWeight: '600', // Bolder Playfair
    marginBottom: '1rem',
    fontFamily: '"Playfair Display", serif',
    lineHeight: 1.2
  },
  serviceDescription: {
    fontSize: '1rem',
    marginBottom: '1.75rem', // More space before button
    opacity: 0.9,
    fontFamily: '"Inter", sans-serif'
  },
  serviceButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '0.75rem 2rem', // Adjusted padding
    borderRadius: '30px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)' // Subtle shadow for button
  },
  roomTypesSection: {
    paddingTop: '3rem',
    maxWidth: '1200px',
    margin: '0 auto' // Center section content
  },
  roomTypesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem'
  },
  roomTypeCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.07)', // Softer shadow
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  roomTypeImageContainer: {
    height: '220px',
    overflow: 'hidden' // For image zoom effect
  },
  roomTypeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease-out' // Smooth zoom
  },
  roomTypeContent: {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  roomTypeName: {
    fontSize: '1.375rem',
    fontWeight: '600', // Bolder Playfair
    color: '#2d3748',
    marginBottom: '0.75rem', // Increased margin
    fontFamily: '"Playfair Display", serif'
  },
  roomTypeDescription: {
    fontSize: '0.9rem', // Consistent size
    color: '#4a5568',
    lineHeight: 1.6,
    marginBottom: '1rem',
    // flexGrow: 1 removed, use marginTop: 'auto' on the price/capacity container
  },
  roomTypePrice: {
    fontSize: '1.25rem', // Slightly larger price
    fontWeight: '700', // Bolder price
    color: '#d4af37', // Gold color
    marginBottom: '0.25rem' // Reduced margin
  },
  roomTypeCapacity: {
    fontSize: '0.8rem',
    color: '#718096', // Softer gray
    // textTransform: 'uppercase', // Optional
    letterSpacing: '0.25px'
  },
  // Keyframes for spin animation - this typically goes in a global CSS file or <style> tag
  // For JS-in-CSS, libraries handle this. Inline style animation property will look for global keyframes.
  // '@keyframes spin': { // This syntax is for CSS, not directly for React style objects
  //   '0%': { transform: 'rotate(0deg)' },
  //   '100%': { transform: 'rotate(360deg)' }
  // }
};

// To make the spin animation work without global CSS, you'd typically inject a <style> tag.
// For this exercise, we assume @keyframes spin is defined globally.
// Example of how to inject keyframes if needed (usually done in App.js or index.js):
// const styleSheet = document.createElement("style")
// styleSheet.innerText = `
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `
// document.head.appendChild(styleSheet)

export default HotelSearchPage;