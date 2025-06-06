import axiosClient from './axios';

export const staffApi = {
  getAllStaff: () => {
    return axiosClient.get('/api/auth/staff');
  },

  getStaffById: (id) => {
    return axiosClient.get(`/api/auth/staff/${id}`);
  },

  createStaff: (staffData) => {
    return axiosClient.post('/api/auth/staff', staffData);
  },

  updateStaff: (id, updateData) => {
    return axiosClient.patch(`/api/auth/staff/${id}`, updateData);
  },

  deleteStaff: (id) => {
    return axiosClient.delete(`/api/auth/staff/${id}`);
  },
};

export default staffApi; 