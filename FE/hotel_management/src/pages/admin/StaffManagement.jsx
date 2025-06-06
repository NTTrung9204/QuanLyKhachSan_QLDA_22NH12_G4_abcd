import React, { useState, useEffect } from 'react';
import { staffApi } from '../../api/staffApi';
import { toast } from 'react-toastify';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Popconfirm,
  Space,
  Card,
} from 'antd';
import moment from 'moment';

const { Option } = Select;

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffApi.getAllStaff();
      console.log('Full API Response:', response);
      
      // Access the correct nested structure
      const staffData = response.data?.data?.staff || [];
      console.log('Staff Data:', staffData);
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Failed to fetch staff data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        birthDate: values.birthDate.format('YYYY-MM-DD'),
      };

      if (editingStaff) {
        await staffApi.updateStaff(editingStaff._id, formattedValues);
        toast.success('Staff updated successfully');
      } else {
        await staffApi.createStaff(formattedValues);
        toast.success('Staff created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      fetchStaff();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  // Handle staff deletion
  const handleDelete = async (id) => {
    try {
      await staffApi.deleteStaff(id);
      toast.success('Staff deleted successfully');
      fetchStaff();
    } catch (error) {
      toast.error('Failed to delete staff');
    }
  };

  // Handle edit button click
  const handleEdit = (record) => {
    setEditingStaff(record);
    form.setFieldsValue({
      ...record.profile,
      username: record.username,
      birthDate: moment(record.profile.birthDate),
    });
    setModalVisible(true);
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Full Name',
      dataIndex: ['profile', 'fullName'],
      key: 'fullName',
      sorter: (a, b) => a.profile.fullName.localeCompare(b.profile.fullName),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: ['profile', 'email'],
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: ['profile', 'phone'],
      key: 'phone',
    },
    {
      title: 'Gender',
      dataIndex: ['profile', 'gender'],
      key: 'gender',
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: 'Status',
      dataIndex: ['profile', 'state'],
      key: 'state',
      render: (text) => (
        <span style={{ 
          color: text === 'active' ? '#52c41a' : '#ff4d4f',
          textTransform: 'capitalize'
        }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this staff member?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Staff Management"
        extra={
          <Button type="primary" onClick={() => {
            setEditingStaff(null);
            form.resetFields();
            setModalVisible(true);
          }}>
            Add New Staff
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={staff}
          rowKey="_id"
          loading={loading}
          scroll={{ x: true }}
        />
      </Card>

      <Modal
        title={editingStaff ? 'Edit Staff' : 'Add New Staff'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            gender: 'male',
            state: 'active',
          }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input disabled={!!editingStaff} />
          </Form.Item>

          {!editingStaff && (
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input password!' }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please input full name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please input a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="cccd"
            label="CCCD"
            rules={[{ required: true, message: 'Please input CCCD!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="birthDate"
            label="Birth Date"
            rules={[{ required: true, message: 'Please select birth date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender!' }]}
          >
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="state"
            label="Status"
            rules={[{ required: true, message: 'Please select status!' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingStaff ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement; 