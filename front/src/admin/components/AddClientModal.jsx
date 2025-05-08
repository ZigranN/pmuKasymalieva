import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select, DatePicker, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, fetchUsers } from "../features/users/usersThunk.js";
import { fetchServices } from "../features/services/servicesThunks.js";
import dayjs from 'dayjs';
import './../styles/EditClientModal.css';

const { Option } = Select;

const AddClientModal = ({ isVisible, onClose }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { services } = useSelector((state) => state.services);

    useEffect(() => {
        if (isVisible) {
            dispatch(fetchServices());
        }
    }, [dispatch, isVisible]);

    const handleSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                birthDate: values.birthDate ? dayjs(values.birthDate).toISOString() : null,
                firstAppointmentDate: values.firstAppointmentDate ? dayjs(values.firstAppointmentDate).toISOString() : null,
                nextAppointmentDate: values.nextAppointmentDate ? dayjs(values.nextAppointmentDate).toISOString() : null,
                childrenAge: values.childrenAge ? values.childrenAge.map(Number) : []
            };

            await dispatch(addUser(payload));
            await dispatch(fetchUsers());
            message.success('Клиент успешно добавлен!');
            form.resetFields();
            onClose();
        } catch (error) {
            console.error('Ошибка при добавлении клиента:', error.message);
            message.error('Ошибка при добавлении клиента.');
        }
    };

    return (
        <Modal
            title='Добавить нового клиента'
            open={isVisible}
            onCancel={onClose}
            footer={null}
            className="custom-modal"
        >
            <Form form={form} layout='vertical' onFinish={handleSubmit} className="custom-form">
                <Form.Item label='Имя' name='firstName' rules={[{ required: true, message: 'Введите имя' }]}>
                    <Input placeholder="Введите имя" />
                </Form.Item>
                <Form.Item label='Фамилия' name='lastName' rules={[{ required: true, message: 'Введите фамилию' }]}>
                    <Input placeholder="Введите фамилию" />
                </Form.Item>
                <Form.Item label='Телефон' name='phone' rules={[{ required: true, message: 'Введите номер телефона' }]}>
                    <Input placeholder="+996 (XXX) XXX-XXX" />
                </Form.Item>
                <Form.Item label='Почта' name='email'>
                    <Input placeholder="example@mail.com" />
                </Form.Item>
                <Form.Item label='Telegram' name='telegram'>
                    <Input placeholder="@username" />
                </Form.Item>
                <Form.Item label='WhatsApp' name='whatsapp'>
                    <Input placeholder="+996 (XXX) XXX-XXX" />
                </Form.Item>
                <Form.Item label='Дата рождения' name='birthDate'>
                    <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label='Заметки' name='notes'>
                    <Input.TextArea placeholder="Заметки по клиенту" />
                </Form.Item>
                <Form.Item label='Комментарии' name='comments'>
                    <Input.TextArea placeholder="Комментарии по клиенту" />
                </Form.Item>
                <Form.Item label='Количество детей' name='childrenCount'>
                    <Input type="number" placeholder="0" />
                </Form.Item>
                <Form.Item label='Возраст детей' name='childrenAge'>
                    <Select mode='tags' placeholder='Введите возраст детей'>
                        <Option key="1" value="1">1</Option>
                        <Option key="2" value="2">2</Option>
                        <Option key="3" value="3">3</Option>
                    </Select>
                </Form.Item>
                <Form.Item label='Дата записи' name='firstAppointmentDate'>
                    <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label='Следующая запись' name='nextAppointmentDate'>
                    <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label='Услуги' name='serviceIds'>
                    <Select mode='multiple' placeholder='Выберите услуги'>
                        {Array.isArray(services) ? services.map((service) => (
                            <Option key={service._id} value={service._id}>
                                {service.name}
                            </Option>
                        )) : null}
                    </Select>
                </Form.Item>
                <Form.Item label='Дополнительные услуги' name='additionalServiceIds'>
                    <Select mode='multiple' placeholder='Выберите дополнительные услуги'>
                        {Array.isArray(services) ? services.map((service) => (
                            <Option key={service._id} value={service._id}>
                                {service.name}
                            </Option>
                        )) : null}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' block>
                        Добавить клиента
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddClientModal;
