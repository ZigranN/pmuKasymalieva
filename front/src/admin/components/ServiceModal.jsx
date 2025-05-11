import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import { useAppDispatch } from "../../app/hooks";
import { createService, updateService, fetchServices } from "../features/services/servicesThunks";

const ServiceModal = ({ isVisible, onClose, service }) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    // ✅ Устанавливаем начальные значения при открытии
    useEffect(() => {
        if (service) {
            form.setFieldsValue({
                name: service.name,
                description: service.description,
                price: service.price,
                duration: service.duration,
            });
        } else {
            form.resetFields();
        }
    }, [service, form]);

    // ✅ Обработка отправки формы
    const handleSubmit = async (values) => {
        try {
            if (service) {
                await dispatch(updateService({ id: service._id, serviceData: values })).unwrap();
                message.success('Услуга успешно обновлена!');
            } else {
                await dispatch(createService(values)).unwrap();
                message.success('Услуга успешно добавлена!');
            }
            await dispatch(fetchServices());
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении услуги:', error.message);
            message.error('Ошибка при сохранении услуги.');
        }
    };

    return (
        <Modal
            title={service ? 'Редактировать услугу' : 'Добавить новую услугу'}
            open={isVisible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
            className="custom-modal"
        >
            <Form
                form={form}
                layout='vertical'
                onFinish={handleSubmit}
                initialValues={{
                    name: '',
                    description: '',
                    price: 0,
                    duration: 15
                }}
                className="custom-form"
            >
                <Form.Item
                    label='Название услуги'
                    name='name'
                    rules={[{ required: true, message: 'Введите название' }]}
                >
                    <Input placeholder="Введите название" />
                </Form.Item>

                <Form.Item label='Описание' name='description'>
                    <Input.TextArea placeholder="Введите описание" />
                </Form.Item>

                <Form.Item
                    label='Цена (euro)'
                    name='price'
                    rules={[{ required: true, message: 'Введите цену' }]}
                >
                    <InputNumber min={0} placeholder="Введите цену" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label='Длительность (мин)'
                    name='duration'
                    rules={[{ required: true, message: 'Введите длительность' }]}
                >
                    <InputNumber min={15} placeholder="Введите длительность" style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit' block>
                        {service ? 'Сохранить изменения' : 'Добавить услугу'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ServiceModal;
