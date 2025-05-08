import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { updateService, fetchServices } from "../features/services/servicesThunks";
import './../styles/EditServiceModal.css';

const EditServiceModal = ({ isVisible, onClose, service }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    useEffect(() => {
        if (service) {
            form.setFieldsValue({
                ...service
            });
        }
    }, [service, form]);

    const handleSubmit = async (values) => {
        try {
            await dispatch(updateService({ id: service._id, serviceData: values }));
            await dispatch(fetchServices());
            message.success('Услуга успешно обновлена!');
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении услуги:', error.message);
            message.error('Ошибка при обновлении услуги.');
        }
    };

    return (
        <Modal
            title='Редактировать услугу'
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
                <Form.Item label='Цена (сом)' name='price' rules={[{ required: true, message: 'Введите цену' }]}>
                    <InputNumber min={0} placeholder="Введите цену" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label='Длительность (мин)' name='duration' rules={[{ required: true, message: 'Введите длительность' }]}>
                    <InputNumber min={15} placeholder="Введите длительность" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' block>
                        Сохранить изменения
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditServiceModal;
