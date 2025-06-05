import React, { useState, useEffect, useRef } from 'react';

const HotelIntroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '5rem 0',
        backgroundImage: 'url("https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '5rem',
          alignItems: 'center'
        }}>
          
          {/* Left Content - Logo and Title */}
          <div style={{
            textAlign: 'left',
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: '0.1s'
          }}>
            <div style={{marginBottom: '4rem'}}>
              <div style={{
                width: '5rem',
                height: '5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem'
              }}>
                <span style={{color: 'white', fontSize: '2rem'}}>⚓</span>
              </div>
              
              <div style={{color: 'white'}}>
                <div style={{
                  fontSize: '0.875rem',
                  letterSpacing: '0.25em',
                  fontWeight: 300,
                  marginBottom: '0.75rem'
                }}>
                  KHÁCH SẠN BIỂN XANH
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  letterSpacing: '0.15em',
                  fontWeight: 300,
                  marginBottom: '0.25rem'
                }}>
                  LUXURY BOUTIQUE
                </div>
                <div style={{
                  color: '#60a5fa',
                  fontSize: '1.5rem',
                  letterSpacing: '0.15em',
                  fontWeight: 500
                }}>
                  HOTEL
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Description */}
          <div style={{
            transform: isVisible ? 'translateX(0)' : 'translateX(60px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: '0.3s'
          }}>
            <div style={{color: 'white'}}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 300,
                lineHeight: 1.5,
                marginBottom: '2rem',
                fontFamily: 'serif'
              }}>
                Một khách sạn hiện đại từ những năm 2020. 
                Một truyền thống gia đình được chuyển đổi 
                thành một khách sạn boutique tuyệt đẹp
              </h1>

              <p style={{
                fontSize: '1.125rem',
                lineHeight: 1.7,
                fontWeight: 300,
                marginBottom: '3rem',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                Tọa lạc tại bãi biển Mỹ Khê, khu vực đẹp nhất của 
                thành phố Đà Nẵng, gần với tất cả các điểm tham quan như 
                Hội An, các viện bảo tàng nổi tiếng nhất như Bảo tàng 
                Điêu khắc Chăm, trung tâm lịch sử, công viên, nhà hàng.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                marginBottom: '3rem'
              }}>
                <div>
                  <h3 style={{
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem'
                  }}>Boutique Style</h3>
                  <p style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem'}}>
                    Thiết kế tinh tế với phong cách boutique độc đáo
                  </p>
                </div>
                <div>
                  <h3 style={{
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem'
                  }}>Vị Trí Đẹp</h3>
                  <p style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem'}}>
                    Ngay tại bãi biển Mỹ Khê, trung tâm thành phố
                  </p>
                </div>
                <div>
                  <h3 style={{
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    marginBottom: '0.5rem'
                  }}>Dịch Vụ 5 Sao</h3>
                  <p style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem'}}>
                    Trải nghiệm đẳng cấp với dịch vụ chuyên nghiệp
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                <button style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  Đặt Phòng Ngay →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelIntroSection;