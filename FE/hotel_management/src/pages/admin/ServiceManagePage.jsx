import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/axios';

const ServiceManagePage = () => {
  const [services, setServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });

  // Fetch services
  const fetchServices = async () => {
    try {
      const response = await api.get('/api/services');
      console.log(response.data.data);
      setServices(response.data.data);
    } catch (error) {
      alert('Failed to fetch services');
    }
  };

  // Fetch images
  const fetchImages = async () => {
    try {
      const response = await api.get('/api/images');
      setImages(response.data.data);
    } catch (error) {
      alert('Failed to fetch images');
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormData({ name: '', price: '', description: '' });
    setSelectedImage(null);
    setImageId(null);
  };  

  const showImageModal = () => {
    fetchImages();
    setIsImageModalVisible(true);
  };

  const handleImageSelect = (imageUrl, imageId) => {
    setImageId(imageId);
    setSelectedImage(imageUrl);
    setIsImageModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage && !imageId) {
      alert('Please select an image');
      return;
    }
    try {
      await api.post('/api/services', {
        ...formData,
        imageId: imageId
      });
      alert('Service added successfully');
      setIsModalVisible(false);
      setFormData({ name: '', price: '', description: '' });
      setSelectedImage(null);
      setImageId(null);
      fetchServices();
    } catch (error) {
      alert('Failed to add service');
    }
  };

  // Add delete service function
  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/api/services/${serviceId}`);
        alert('Service deleted successfully');
        fetchServices(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service');
      }
    }
  };

  return (
    <div className="service-page">
      <div className="service-header">
        <h2>Service Management</h2>
        <button className="add-button" onClick={showModal}>
          + Add Service
        </button>
      </div>

      <div className="service-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"}>
                <td>
                  <img src={service.imageId.path} alt={service.name} className="service-image" />
                </td>
                <td>{service.name}</td>
                <td>${service.price}</td>
                <td>{service.description}</td>
                <td>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteService(service._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Service</h3>
              <button className="close-button" onClick={handleCancel}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="service-form">
              <div className="form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                {selectedImage && (
                  <img src={selectedImage} alt="Selected" className="selected-image" />
                )}
                <button type="button" className="select-image-button" onClick={showImageModal}>
                  {selectedImage ? 'Change Image' : 'Select Image'}
                </button>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">Submit</button>
                <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImageModalVisible && (
        <div className="modal-overlay">
          <div className="modal image-modal">
            <div className="modal-header">
              <h3>Select Image</h3>
              <button className="close-button" onClick={() => setIsImageModalVisible(false)}>
                &times;
              </button>
            </div>
            <div className="image-grid">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="image-item"
                  onClick={() => handleImageSelect(image.path, image._id)}
                >
                  <img src={image.path} alt={`Option ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .service-page {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
          margin-top: 200px; /* Remove top margin to position at top */
          margin-bottom: auto;
          background-color: #f5f6fa;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }

        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
        }

        .service-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding: 16px 20px;
          background-color: #3a1c71;
          border-radius: 8px;
          color: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .add-button {
          background-color: #00a550;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .add-button:hover {
          background-color: #008742;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .service-table {
          width: 100%;
          overflow-x: auto;
          margin-top: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background-color: white;
          overflow: hidden;
          border-radius: 8px;
        }

        th, td {
          padding: 16px;
          text-align: left;
        }

        th {
          background-color: #4b2e8c;
          color: white;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-size: 14px;
        }

        th:first-child {
          border-top-left-radius: 8px;
        }

        th:last-child {
          border-top-right-radius: 8px;
        }

        tr:last-child td:first-child {
          border-bottom-left-radius: 8px;
        }

        tr:last-child td:last-child {
          border-bottom-right-radius: 8px;
        }

        .even-row {
          background-color: #f0f2fa;
        }

        .odd-row {
          background-color: #ffffff;
        }

        tr:hover {
          background-color: #e8f0fa;
        }

        .service-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
        }

        .service-image:hover {
          transform: scale(1.1);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background-color: white;
          border-radius: 12px;
          padding: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .image-modal {
          max-width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #dde0f0;
        }

        .modal-header h3 {
          color: #3a1c71;
          font-size: 24px;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .service-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-weight: 500;
        }

        input, textarea {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        .selected-image {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
          margin: 8px 0;
        }

        .select-image-button {
          background-color: #3a1c71;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .select-image-button:hover {
          background-color: #4b2e8c;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .submit-button, .cancel-button {
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          border: none;
        }

        .submit-button {
          background-color: #4CAF50;
          color: white;
        }

        .submit-button:hover {
          background-color: #45a049;
        }

        .cancel-button {
          background-color: #f44336;
          color: white;
        }

        .cancel-button:hover {
          background-color: #d32f2f;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
          padding: 16px;
        }

        .image-item {
          cursor: pointer;
          transition: transform 0.2s;
        }

        .image-item:hover {
          transform: scale(1.05);
        }

        .image-item img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
        }

        .delete-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .delete-button:hover {
          background-color: #d32f2f;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        th:last-child,
        td:last-child {
          text-align: center;
          width: 100px;
        }
      `}</style>
    </div>
  );
};

export default ServiceManagePage;
