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
    tableContainer: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.5)'
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
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1rem'
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
    actionTd: {
        padding: '12px',
        borderBottom: '1px solid #e2e8f0',
        textAlign: 'center',
        width: '80px'
    },
    deleteButton: {
        backgroundColor: 'transparent',
        color: '#ef4444',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px'
    },
    modal: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px'
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
        fontWeight: 'bold'
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
    confirmDialog: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 1000
    },
    confirmButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '0.5rem',
        marginTop: '1rem'
    }
};

const FacilityManagePage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "Máy lạnh",
        description: "Máy lạnh hiện đại, tiết kiệm điện"
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchFacilities = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/facilities');
            const data = response.data.data;
            console.log(data);
            setFacilities(data);
        } catch (error) {
            alert('Không thể tải danh sách thiết bị');
            console.error('Error fetching facilities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacilities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const values = { ...formData, icon: "air-conditioner" };
            console.log(values);
            await api.post('/api/facilities', values);
            alert('Thêm thiết bị thành công');
            setIsModalVisible(false);
            setFormData({
                name: "Máy lạnh",
                description: "Máy lạnh hiện đại, tiết kiệm điện"
            });
            fetchFacilities();
        } catch (error) {
            alert('Không thể thêm thiết bị');
            console.error('Error adding facility:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            console.log(id);
            await api.delete(`/api/facilities/${id}`);
            alert('Xóa thiết bị thành công');
            fetchFacilities();
            setDeleteConfirm(null);
        } catch (error) {
            alert('Không thể xóa thiết bị');
            console.error('Error deleting facility:', error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Quản lý thiết bị</h1>
                <button style={styles.addButton} onClick={() => setIsModalVisible(true)}>
                    Thêm thiết bị
                </button>
            </div>

            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Tên thiết bị</th>
                            <th style={styles.th}>Mô tả</th>
                            <th style={styles.th}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {facilities.map((facility) => (
                            <tr key={facility._id}>
                                <td style={styles.td}>{facility.name}</td>
                                <td style={styles.td}>{facility.description}</td>
                                <td style={styles.actionTd}>
                                    <button 
                                        style={styles.deleteButton}
                                        onClick={() => setDeleteConfirm(facility._id)}
                                    >
                                        ✕
                                    </button>
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
                            <h2 style={styles.modalTitle}>Thêm thiết bị mới</h2>
                            <button 
                                style={styles.deleteButton}
                                onClick={() => setIsModalVisible(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <form style={styles.form} onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Tên thiết bị</label>
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
                                <label style={styles.label}>Mô tả</label>
                                <textarea
                                    style={styles.textarea}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
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
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div style={styles.modal}>
                    <div style={styles.confirmDialog}>
                        <h3 style={{color: '#000000'}}>Xóa thiết bị</h3>
                        <p style={{color: '#000000'}}>Bạn có chắc chắn muốn xóa thiết bị này?</p>
                        <div style={styles.confirmButtons}>
                            <button 
                                style={styles.cancelButton}
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Hủy
                            </button>
                            <button 
                                style={{...styles.submitButton, backgroundColor: '#ef4444'}}
                                onClick={() => handleDelete(deleteConfirm)}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacilityManagePage;
