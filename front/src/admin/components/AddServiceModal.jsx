import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { createService, fetchServices } from "../features/services/servicesThunks";
import './../styles/EditServiceModal.css';

const AddServiceModal = ({ isVisible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            await dispatch(createService(values));
            await dispatch(fetchServices());
            message.success('Услуга успешно добавлена!');
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении услуги:', error.message);
            message.error('Ошибка при добавлении услуги.');
        }
    };

    return (
        <Modal
            title='Добавить новую услугу'
            open={isVisible}
            onCancel={onClose}
            footer={null}
            className="custom-modal"
        >
            <Form form={form} layout='vertical' onFinish={handleSubmit} className="custom-form">
                <Form.Item label='Название услуги' name='name' rules={[{ required: true, message: 'Введите название' }]}>
                    <Input placeholder="Введите название" />
                </Form.Item>
                <Form.Item label='Описание' name='description'>
                    <Input.TextArea placeholder="Введите описание" />
                </Form.Item>
                <Form.Item label='Цена (euro)' name='price' rules={[{ required: true, message: 'Введите цену' }]}>
                    <InputNumber min={0} placeholder="Введите цену" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label='Длительность ' name='duration' rules={[{ required: true, message: 'Введите длительность' }]}>
                    <Input  placeholder="Введите длительность" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' block>
                        Добавить услугу
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddServiceModal;
