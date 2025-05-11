import React, { useState, useEffect } from 'react';
import ImageUploadModal from '../../components/ImageUploadModal';
import api from '../../api/axios';

const ImageManagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch danh sách ảnh khi component mount
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/images');
      console.log(response.data.data);
      setImages(response.data.data);
    } catch (error) {
      setError('Không thể tải danh sách ảnh');
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = async (data) => {
    try {
      // Refresh danh sách ảnh sau khi upload thành công
      await fetchImages();
      
      // Hiển thị thông báo thành công (có thể thêm một component Toast ở đây)
      console.log('Upload thành công:', data);
    } catch (error) {
      console.error('Error after upload:', error);
    }
  };

  const renderImages = () => {
    if (loading) {
      return (
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Đang tải...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={styles.errorState}>
          <p>{error}</p>
          <button onClick={fetchImages} style={styles.retryButton}>
            Thử lại
          </button>
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🖼️</div>
          <p style={styles.emptyText}>Chưa có hình ảnh nào</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            style={styles.emptyButton}
          >
            Tải ảnh lên ngay
          </button>
        </div>
      );
    }

    return images.map((image) => (
      <div key={image._id} style={styles.imageCard}>
        <img 
          src={image.path} 
          alt={image.filename} 
          style={styles.image}
        />
        <div style={styles.imageInfo}>
          <p style={styles.imageName}>{image.filename}</p>
          <button 
            onClick={() => handleDeleteImage(image._id)}
            style={styles.deleteButton}
          >
            🗑️
          </button>
        </div>
      </div>
    ));
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Bạn có chắc muốn xóa ảnh này?')) {
      try {
        console.log(imageId);   
        await api.delete(`/api/images/${imageId}`);
        await fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
        setError('Không thể xóa ảnh. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Quản lý hình ảnh</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={styles.uploadButton}
        >
          Tải ảnh lên
        </button>
      </div>

      <ImageUploadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <div style={styles.imageGrid}>
        {renderImages()}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    width: '100%'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  uploadButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)'
    }
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    flex: 1,
    width: '100%',
    boxSizing: 'border-box'
  },
  emptyState: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  },
  emptyText: {
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '1rem'
  },
  emptyButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)'
    }
  },
  loadingState: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  errorState: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    color: '#991b1b'
  },
  retryButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  imageCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)'
    }
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover'
  },
  imageInfo: {
    padding: '0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e2e8f0'
  },
  imageName: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#1e293b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  deleteButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.25rem',
    padding: '0.25rem',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#fee2e2'
    }
  },
  spinner: {
    width: '2rem',
    height: '2rem',
    border: '3px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  }
};

export default ImageManagePage; 