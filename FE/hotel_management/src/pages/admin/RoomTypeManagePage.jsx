import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

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
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#000000'
  },
  addButton: {
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  modalTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#000000'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#f8fafc'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    color: '#000000'
  },
  textarea: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '100px',
    resize: 'vertical',
    backgroundColor: '#f8fafc',
    color: '#000000'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#f8fafc',
    color: '#000000'
  },
  amenitiesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  amenityRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  addAmenityButton: {
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  removeButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  cancelButton: {
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    color: 'red'
  },
  submitButton: {
    padding: '8px 16px',
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  selectContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  multiSelect: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    color: '#000000',
    minHeight: '100px'
  },
  selectedItemsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '0.5rem'
  },
  selectedItem: {
    backgroundColor: '#e5e7eb',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#000000'
  },
  selectionModal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    zIndex: 1100
  },
  selectionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  selectionItem: {
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#f8fafc',
    transition: 'background-color 0.2s',
    color: '#000000',
    ':hover': {
      backgroundColor: '#e5e7eb'
    }
  },
  selectionItemSelected: {
    backgroundColor: '#bfdbfe',
    borderColor: '#3b82f6'
  },
  selectButton: {
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  imageItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    border: '1px solid #e5e7eb',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#f8fafc',
    transition: 'background-color 0.2s',
    color: '#000000',
    ':hover': {
      backgroundColor: '#e5e7eb'
    }
  },
  imagePreview: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  selectedImageItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#e5e7eb',
    padding: '4px 8px',
    borderRadius: '4px',
    color: '#000000'
  },
  selectedImagePreview: {
    width: '30px',
    height: '30px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.5)'
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#1f2937',
    backgroundColor: '#f8fafc',
    minWidth: '150px'
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'left',
    verticalAlign: 'top',
    color: '#000000'
  },
  amenitiesList: {
    margin: 0,
    padding: 0,
    listStyle: 'none'
  },
  amenityItem: {
    marginBottom: '4px',
    color: '#000000'
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.5)'
  },
  facilitiesList: {
    margin: 0,
    padding: 0,
    listStyle: 'none'
  },
  facilityItem: {
    marginBottom: '4px',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  imagesList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    margin: 0,
    padding: 0,
    listStyle: 'none'
  },
  tableImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px'
  },
  actionColumn: {
    width: '80px',
    textAlign: 'center'
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
  },
  editButton: {
    backgroundColor: '#1890ff',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

const RoomTypeManagePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "Phòng Deluxe",
    pricePerNight: 1200000,
    maxAdult: 2,
    maxChild: 1,
    description: "Phòng sang trọng với tầm nhìn ra thành phố, diện tích 30m²",
    amenities: ["Bữa sáng miễn phí", "Dịch vụ phòng 24/7", "Đồ dùng phòng tắm cao cấp"],
    facilityIds: [],
    imageIds: []
  });
  const [facilities, setFacilities] = useState([]);
  const [images, setImages] = useState([]);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRoomTypes();
    fetchFacilities();
    fetchImages();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/room-types');
      console.log(response.data.data);
      setRoomTypes(response.data.data);
    } catch (error) {
      alert('Không thể tải danh sách loại phòng');
      console.error('Error fetching room types:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await api.get('/api/facilities');
      setFacilities(response.data.data);
    } catch (error) {
      alert('Không thể tải danh sách thiết bị');
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await api.get('/api/images');
      console.log(response.data.data);
      setImages(response.data.data);
    } catch (error) {
      alert('Không thể tải danh sách hình ảnh');
      console.error('Error fetching images:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData(prev => ({
      ...prev,
      amenities: newAmenities
    }));
  };

  const addAmenity = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, ""]
    }));
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleMultiSelectChange = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      [field]: selectedOptions
    }));
  };

  const handleEdit = (roomType) => {
    setEditingId(roomType._id);
    setFormData({
      name: roomType.name,
      pricePerNight: roomType.pricePerNight,
      maxAdult: roomType.maxAdult,
      maxChild: roomType.maxChild,
      description: roomType.description,
      amenities: roomType.amenities,
      facilityIds: roomType.facilityIds.map(f => f._id),
      imageIds: roomType.imageIds
    });
    setSelectedFacilities(facilities.filter(f =>
      roomType.facilityIds.some(rf => rf._id === f._id)
    ));
    setSelectedImages(images.filter(img =>
      roomType.imageIds.includes(img._id)
    ));
    setIsModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.patch(`/api/room-types/${editingId}`, formData);
        alert('Cập nhật loại phòng thành công');
      } else {
        await api.post('/api/room-types', formData);
        alert('Thêm loại phòng thành công');
      }
      setIsModalVisible(false);
      setEditingId(null);
      setFormData({
        name: "Phòng Deluxe",
        pricePerNight: 1200000,
        maxAdult: 2,
        maxChild: 1,
        description: "Phòng sang trọng với tầm nhìn ra thành phố, diện tích 30m²",
        amenities: ["Bữa sáng miễn phí", "Dịch vụ phòng 24/7", "Đồ dùng phòng tắm cao cấp"],
        facilityIds: [],
        imageIds: []
      });
      setSelectedFacilities([]);
      setSelectedImages([]);
      fetchRoomTypes();
    } catch (error) {
      alert(editingId ? 'Không thể cập nhật loại phòng' : 'Không thể thêm loại phòng');
      console.error('Error saving room type:', error);
    }
  };

  const handleFacilitySelect = (facility) => {
    const isSelected = selectedFacilities.some(f => f._id === facility._id);
    if (isSelected) {
      setSelectedFacilities(selectedFacilities.filter(f => f._id !== facility._id));
      setFormData(prev => ({
        ...prev,
        facilityIds: prev.facilityIds.filter(id => id !== facility._id)
      }));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
      setFormData(prev => ({
        ...prev,
        facilityIds: [...prev.facilityIds, facility._id]
      }));
    }
  };

  const handleImageSelect = (image) => {
    const isSelected = selectedImages.some(i => i._id === image._id);
    if (isSelected) {
      setSelectedImages(selectedImages.filter(i => i._id !== image._id));
      setFormData(prev => ({
        ...prev,
        imageIds: prev.imageIds.filter(id => id !== image._id)
      }));
    } else {
      setSelectedImages([...selectedImages, image]);
      setFormData(prev => ({
        ...prev,
        imageIds: [...prev.imageIds, image._id]
      }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
      try {
        await api.delete(`/api/room-types/${id}`);
        alert('Xóa loại phòng thành công');
        fetchRoomTypes();
      } catch (error) {
        alert('Không thể xóa loại phòng');
        console.error('Error deleting room type:', error);
      }
    }
  };

  const facilitiesSection = (
    <div style={styles.formGroup}>
      <label style={styles.label}>Thiết bị</label>
      <button
        type="button"
        style={styles.selectButton}
        onClick={() => setShowFacilityModal(true)}
      >
        Chọn thiết bị
      </button>
      <div style={styles.selectedItemsContainer}>
        {selectedFacilities.map(facility => (
          <div key={facility._id} style={styles.selectedItem}>
            <span>{facility.name}</span>
            <button
              type="button"
              style={{ ...styles.removeButton, padding: '2px 4px' }}
              onClick={() => handleFacilitySelect(facility)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const imagesSection = (
    <div style={styles.formGroup}>
      <label style={styles.label}>Hình ảnh</label>
      <button
        type="button"
        style={styles.selectButton}
        onClick={() => setShowImageModal(true)}
      >
        Chọn hình ảnh
      </button>
      <div style={styles.selectedItemsContainer}>
        {selectedImages.map(image => (
          <div key={image._id} style={styles.selectedImageItem}>
            <img
              src={image.path}
              alt={image.filename || 'Room image'}
              style={styles.selectedImagePreview}
            />
            <span>{image.filename || image._id}</span>
            <button
              type="button"
              style={{ ...styles.removeButton, padding: '2px 4px' }}
              onClick={() => handleImageSelect(image)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const selectionModals = (
    <>
      {showFacilityModal && (
        <div style={styles.modal}>
          <div style={styles.selectionModal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Chọn thiết bị</h3>
              <button
                style={{ ...styles.removeButton, padding: '8px' }}
                onClick={() => setShowFacilityModal(false)}
              >
                ✕
              </button>
            </div>
            <div style={styles.selectionList}>
              {facilities.map(facility => (
                <div
                  key={facility._id}
                  style={{
                    ...styles.selectionItem,
                    ...(selectedFacilities.some(f => f._id === facility._id) ? styles.selectionItemSelected : {})
                  }}
                  onClick={() => handleFacilitySelect(facility)}
                >
                  {facility.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showImageModal && (
        <div style={styles.modal}>
          <div style={styles.selectionModal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Chọn hình ảnh</h3>
              <button
                style={{ ...styles.removeButton, padding: '8px' }}
                onClick={() => setShowImageModal(false)}
              >
                ✕
              </button>
            </div>
            <div style={styles.selectionList}>
              {images.map(image => (
                <div
                  key={image._id}
                  style={{
                    ...styles.imageItem,
                    ...(selectedImages.some(i => i._id === image._id) ? styles.selectionItemSelected : {})
                  }}
                  onClick={() => handleImageSelect(image)}
                >
                  <img
                    src={image.path}
                    alt={image.filename || 'Room image'}
                    style={styles.imagePreview}
                  />
                  <span>{image.filename || image._id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const modalTitle = editingId ? "Cập nhật loại phòng" : "Thêm loại phòng mới";

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Quản lý loại phòng</h1>
        <button style={styles.addButton} onClick={() => {
          setEditingId(null);
          setFormData({
            name: "Phòng Deluxe",
            pricePerNight: 1200000,
            maxAdult: 2,
            maxChild: 1,
            description: "Phòng sang trọng với tầm nhìn ra thành phố, diện tích 30m²",
            amenities: ["Bữa sáng miễn phí", "Dịch vụ phòng 24/7", "Đồ dùng phòng tắm cao cấp"],
            facilityIds: [],
            imageIds: []
          });
          setSelectedFacilities([]);
          setSelectedImages([]);
          setIsModalVisible(true);
        }}>
          Thêm loại phòng
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tên loại phòng</th>
              <th style={styles.th}>Giá mỗi đêm</th>
              <th style={styles.th}>Số người</th>
              <th style={styles.th}>Mô tả</th>
              <th style={styles.th}>Tiện nghi</th>
              <th style={styles.th}>Thiết bị</th>
              <th style={styles.th}>Hình ảnh</th>
              <th style={{ ...styles.th, ...styles.actionColumn }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((roomType) => (
              <tr key={roomType._id}>
                <td style={styles.td}>{roomType.name}</td>
                <td style={styles.td}>{formatPrice(roomType.pricePerNight)}</td>
                <td style={styles.td}>
                  {roomType.maxAdult} người lớn, {roomType.maxChild} trẻ em
                </td>
                <td style={styles.td}>{roomType.description}</td>
                <td style={styles.td}>
                  <ul style={styles.amenitiesList}>
                    {roomType.amenities.map((amenity, index) => (
                      <li key={index} style={styles.amenityItem}>
                        • {amenity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={styles.td}>
                  <ul style={styles.facilitiesList}>
                    {facilities
                      .filter(facility =>
                        roomType.facilityIds.some(f => f._id === facility._id)
                      )
                      .map(facility => (
                        <li key={facility._id} style={styles.facilityItem}>
                          • {facility.name}
                        </li>
                      ))}
                  </ul>
                </td>
                <td style={styles.td}>
                  <ul style={styles.imagesList}>
                    {images
                      .filter(image => roomType.imageIds.includes(image._id))
                      .map(image => (
                        <li key={image._id}>
                          <img
                            src={image.path}
                            alt={image.filename}
                            style={styles.tableImage}
                          />
                        </li>
                      ))}
                  </ul>
                </td>
                <td style={{ ...styles.td, ...styles.actionColumn }}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleEdit(roomType)}
                    >
                      Sửa
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(roomType._id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalVisible && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{modalTitle}</h2>
              <button
                style={{ ...styles.removeButton, padding: '8px' }}
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingId(null);
                }}
              >
                ✕
              </button>
            </div>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tên loại phòng</label>
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Giá mỗi đêm</label>
                <input
                  style={styles.input}
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleNumberInputChange}
                  required
                  min="0"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Số người lớn tối đa</label>
                <input
                  style={styles.input}
                  type="number"
                  name="maxAdult"
                  value={formData.maxAdult}
                  onChange={handleNumberInputChange}
                  required
                  min="1"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Số trẻ em tối đa</label>
                <input
                  style={styles.input}
                  type="number"
                  name="maxChild"
                  value={formData.maxChild}
                  onChange={handleNumberInputChange}
                  required
                  min="0"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Mô tả</label>
                <textarea
                  style={styles.textarea}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tiện nghi</label>
                <div style={styles.amenitiesContainer}>
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} style={styles.amenityRow}>
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        type="text"
                        value={amenity}
                        onChange={(e) => handleAmenityChange(index, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        style={styles.removeButton}
                        onClick={() => removeAmenity(index)}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    style={styles.addAmenityButton}
                    onClick={addAmenity}
                  >
                    Thêm tiện nghi
                  </button>
                </div>
              </div>

              {facilitiesSection}
              {imagesSection}

              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setIsModalVisible(false)}
                >
                  Hủy
                </button>
                <button type="submit" style={styles.submitButton}>
                  Lưu
                </button>
              </div>
            </form>

            {selectionModals}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomTypeManagePage;
