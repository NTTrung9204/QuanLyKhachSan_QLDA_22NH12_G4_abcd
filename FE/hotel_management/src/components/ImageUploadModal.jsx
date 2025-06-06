import React, { useState } from 'react';
import api from '../api/axios';

const ImageUploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setError('');
        // Tạo URL preview cho ảnh
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
      } else {
        setError('Vui lòng chọn file ảnh');
        setSelectedFile(null);
        setPreviewUrl('');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn ảnh để tải lên');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await api.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onUploadSuccess(response.data);
      handleClose();
    } catch {
      setError('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Tải ảnh lên</h3>
          <button onClick={handleClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.modalBody}>
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          <div style={styles.uploadArea}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={styles.fileInput}
              id="imageUpload"
            />
            <label htmlFor="imageUpload" style={styles.uploadLabel}>
              <div style={styles.uploadIcon}>📁</div>
              <div>Chọn ảnh hoặc kéo thả vào đây</div>
              <div style={styles.supportedFormats}>Hỗ trợ: JPG, PNG, GIF</div>
            </label>
          </div>

          {previewUrl && (
            <div style={styles.previewContainer}>
              <img src={previewUrl} alt="Preview" style={styles.preview} />
            </div>
          )}
        </div>

        <div style={styles.modalFooter}>
          <button 
            onClick={handleClose} 
            style={styles.cancelButton}
            disabled={loading}
          >
            Hủy
          </button>
          <button 
            onClick={handleUpload} 
            style={loading ? {...styles.uploadButton, ...styles.buttonDisabled} : styles.uploadButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Đang tải lên...
              </>
            ) : 'Tải lên'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative'
  },
  modalHeader: {
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#64748b',
    padding: '0.5rem',
    '&:hover': {
      color: '#1e293b'
    }
  },
  modalBody: {
    padding: '1rem'
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '0.75rem',
    borderRadius: '6px',
    marginBottom: '1rem'
  },
  uploadArea: {
    border: '2px dashed #e2e8f0',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: '#3b82f6'
    }
  },
  fileInput: {
    display: 'none'
  },
  uploadLabel: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  uploadIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  },
  supportedFormats: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '0.5rem'
  },
  previewContainer: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    textAlign: 'center'
  },
  preview: {
    maxWidth: '100%',
    maxHeight: '200px',
    borderRadius: '4px'
  },
  modalFooter: {
    padding: '1rem',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem'
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#e2e8f0'
    }
  },
  uploadButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
      backgroundColor: '#2563eb'
    }
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
    '&:hover': {
      backgroundColor: '#93c5fd'
    }
  },
  spinner: {
    width: '1rem',
    height: '1rem',
    border: '2px solid #ffffff',
    borderRightColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 0.75s linear infinite'
  }
};

export default ImageUploadModal; 