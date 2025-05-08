import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, fetchUsers } from "../features/users/usersThunk.js";
import { fetchServices } from "../features/services/servicesThunks";
import dayjs from 'dayjs';
import './../styles/EditClientModal.css';

const { Option } = Select;

const EditClientModal = ({ isVisible, onClose, client }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { services } = useSelector((state) => state.services);

    useEffect(() => {
        if (isVisible) {
            dispatch(fetchServices());
        }
    }, [dispatch, isVisible]);

    useEffect(() => {
        if (client && client._id) {
            form.setFieldsValue({
                ...client,
                birthDate: client.birthDate ? dayjs(client.birthDate) : null,
                firstAppointmentDate: client.firstAppointmentDate ? dayjs(client.firstAppointmentDate) : null,
                nextAppointmentDate: client.nextAppointmentDate ? dayjs(client.nextAppointmentDate) : null,
                childrenAge: client.childrenAge ? client.childrenAge.map(String) : [],
                serviceId: client.serviceId || null,  // <-- Добавлено для отображения выбранной услуги
            });
        }
    }, [client, form]);

    const handleSubmit = async (values) => {
        try {
            if (!client || !client._id) {
                message.error("Не удалось получить ID клиента. Обновление невозможно.");
                return;
            }

            const payload = {
                ...values,
                birthDate: values.birthDate ? values.birthDate.toISOString() : null,
                firstAppointmentDate: values.firstAppointmentDate ? values.firstAppointmentDate.toISOString() : null,
                nextAppointmentDate: values.nextAppointmentDate ? values.nextAppointmentDate.toISOString() : null,
                childrenAge: values.childrenAge ? values.childrenAge.map(Number) : [],
            };

            await dispatch(updateUser({ id: client._id, ...payload }));
            await dispatch(fetchUsers());
            message.success('Данные клиента успешно обновлены!');
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении клиента:', error.message);
            message.error('Ошибка при сохранении данных.');
        }
    };

    const handleServiceChange = (value) => {
        form.setFieldsValue({ serviceId: value });
    };

    return (
        <Modal
            title='Редактирование данных клиента'
            open={isVisible}
            onCancel={onClose}
            footer={null}
            className="custom-modal"
        >
            <Form form={form} layout='vertical' onFinish={handleSubmit} className="custom-form">
                <Form.Item label='Имя' name='firstName'>
                    <Input />
                </Form.Item>
                <Form.Item label='Фамилия' name='lastName'>
                    <Input />
                </Form.Item>
                <Form.Item label='Телефон' name='phone'>
                    <Input />
                </Form.Item>
                <Form.Item label='Почта' name='email'>
                    <Input />
                </Form.Item>
                <Form.Item label='Telegram' name='telegram'>
                    <Input />
                </Form.Item>
                <Form.Item label='WhatsApp' name='whatsapp'>
                    <Input />
                </Form.Item>
                <Form.Item label='Дата рождения' name='birthDate'>
                    <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label='Заметки' name='notes'>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label='Комментарии' name='comments'>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label='Количество детей' name='childrenCount'>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label='Возраст детей' name='childrenAge'>
                    <Select mode='tags' placeholder='Введите возраст детей'>
                        {client?.childrenAge?.map((age) => (
                            <Option key={age} value={String(age)}>
                                {age}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label='Дата записи' name='firstAppointmentDate'>
                    <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label='Следующая запись' name='nextAppointmentDate'>
                    <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                </Form.Item>

                {/* 🟢 Выбор услуги с автозакрытием */}
                <Form.Item label='Услуга' name='serviceId'>
                    <Select
                        placeholder='Выберите услугу'
                        onChange={handleServiceChange}
                        dropdownRender={(menu) => (
                            <div>
                                {menu}
                                <div
                                    style={{ padding: '8px', cursor: 'pointer', color: '#1890ff' }}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => form.submit()}
                                >
                                    Применить выбор
                                </div>
                            </div>
                        )}
                    >
                        {services.map((service) => (
                            <Option key={service._id} value={service._id}>
                                {service.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit' block>
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditClientModal;
