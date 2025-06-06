import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

// Add response interceptor for debugging
axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

const HotelServiceListing = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/api/services`);
        console.log('Raw API response:', response.data);
        
        if (!response.data.data || !Array.isArray(response.data.data)) {
          throw new Error('Định dạng dữ liệu không hợp lệ');
        }

        const servicesData = response.data.data.map(service => {
          console.log('Processing service:', service);
          return {
            id: service._id,
            name: service.name,
            type: service.name.toLowerCase().includes('massage') ? 'massage' :
                  service.name.toLowerCase().includes('gym') ? 'gym' :
                  service.name.toLowerCase().includes('buffet') ? 'restaurant' :
                  service.name.toLowerCase().includes('giặt') ? 'laundry' :
                  service.name.toLowerCase().includes('đưa đón') ? 'transport' :
                  service.name.toLowerCase().includes('làm đẹp') ? 'beauty' : 'other',
            price: service.price,
            description: service.description,
            image: service.imageId?.path || '',
            status: service.status || 'available'
          };
        });

        console.log('Processed services data:', servicesData);
        setServices(servicesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);



  // Scroll effect for background parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleFilterChange = (filterKey) => {
    if (filterKey !== selectedFilter) {
      setSelectedFilter(filterKey);
      setAnimationKey(prev => prev + 1);
    }
  };

  const filterOptions = Array.from(new Set(services.map(service => service.type)))
    .filter(type => type)
    .map(type => {
      const servicesOfType = services.filter(s => s.type === type);
      return {
        key: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        count: servicesOfType.length
      };
    });

  const filteredServices = services.filter(service => {
    const matchesFilter = !selectedFilter || service.type === selectedFilter;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  // Loading shimmer animation
  const LoadingCard = () => (
    <div style={{
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
  );

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
              Đang tải dịch vụ...
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
            {[1, 2, 3, 4, 5, 6].map(i => <LoadingCard key={i} />)}
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
            Dịch Vụ Sang Trọng
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Khám phá thế giới dịch vụ đẳng cấp quốc tế với trải nghiệm xa xỉ không giới hạn
          </p>

          {/* Search Bar */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto 2rem',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ của bạn..."
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
                transition: 'all 0.3s ease',
                '::placeholder': { color: 'rgba(255,255,255,0.7)' }
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                e.target.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {filterOptions.map((option, index) => (
              <button
                key={option.key}
                onClick={() => handleFilterChange(option.key)}
                style={{
                  padding: '1rem 2rem',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: selectedFilter === option.key 
                    ? 'rgba(255,255,255,0.2)' 
                    : 'rgba(255,255,255,0.08)',
                  color: 'white',
                  fontWeight: selectedFilter === option.key ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(20px)',
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: isVisible ? 1 : 0,
                  animationDelay: `${index * 0.1}s`,
                  fontSize: '0.95rem',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = selectedFilter === option.key 
                    ? 'rgba(255,255,255,0.2)' 
                    : 'rgba(255,255,255,0.08)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
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
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => {
              const isVisible = true; // Temporarily disable visibility animation
              return (
                <div
                  key={`${service.id}-${animationKey}`}
                  data-card-id={service.id}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isVisible 
                      ? 'translateY(0) scale(1)' 
                      : `translateY(80px) scale(0.9)`,
                    opacity: isVisible ? 1 : 0,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredCard(service.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Image Container */}
                  <div style={{
                    height: '320px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${service.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.6s ease',
                      transform: hoveredCard === service.id ? 'scale(1.1)' : 'scale(1)'
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
                      {formatPrice(service.price)}₫
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
                      {service.name}
                    </h3>

                    <p style={{
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '2rem',
                      lineHeight: '1.7',
                      fontSize: '1rem'
                    }}>
                      {service.description}
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
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}>
                        Đặt ngay
                      </button>
                      
                      <button 
                        onClick={() => {
                          setSelectedService(service);
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
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.8)',
              padding: '4rem',
              fontSize: '1.2rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              Không tìm thấy dịch vụ phù hợp
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedService && (
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
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
              }}
            >
              ×
            </button>

            <div style={{
              height: '400px',
              backgroundImage: `url(${selectedService.image})`,
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
                {selectedService.name}
              </h2>

              <div style={{
                fontSize: '1.8rem',
                fontWeight: '600',
                color: '#60a5fa',
                marginBottom: '2rem'
              }}>
                {formatPrice(selectedService.price)}₫
              </div>

              <p style={{
                color: 'rgba(255,255,255,0.9)',
                lineHeight: '1.8',
                marginBottom: '3rem',
                fontSize: '1.1rem'
              }}>
                {selectedService.description}
              </p>

              <div style={{
                display: 'flex',
                gap: '1.5rem',
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
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}>
                  Đặt dịch vụ ngay
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
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}>
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

export default HotelServiceListing;