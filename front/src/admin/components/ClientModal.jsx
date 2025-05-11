import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import { addUser, updateUser, fetchUsers } from "../features/users/usersThunk.js";
import { fetchServices } from "../features/services/servicesThunks.js";
import dayjs from 'dayjs';
import './../styles/EditClientModal.css';
import { selectServices } from "../features/services/servicesSlice.js";

const { Option } = Select;

const ClientModal = ({ isVisible, onClose, client, isEditMode }) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const services = useAppSelector(selectServices);

    // Загрузка списка услуг при открытии модалки
    useEffect(() => {
        if (isVisible) {
            dispatch(fetchServices());
        }
    }, [dispatch, isVisible]);

    useEffect(() => {
        if (client && client._id) {
            const mainServices = client.serviceIds.map((id) => {
                const foundService = services.find((s) => s._id === id);
                return foundService ? foundService._id : null;
            }).filter(Boolean);

            const additionalServices = client.additionalServiceIds.map((id) => {
                const foundService = services.find((s) => s._id === id);
                return foundService ? foundService._id : null;
            }).filter(Boolean);

            form.setFieldsValue({
                ...client,
                serviceIds: mainServices,
                additionalServiceIds: additionalServices,
                birthDate: client.birthDate ? dayjs(client.birthDate) : null,
                firstAppointmentDate: client.firstAppointmentDate ? dayjs(client.firstAppointmentDate) : null,
                nextAppointmentDate: client.nextAppointmentDate ? dayjs(client.nextAppointmentDate) : null,
                childrenAge: client.childrenAge ? client.childrenAge.map(String) : [],
            });
        }
    }, [client, form, services]);

    // Обработка сохранения данных
    const handleSubmit = async (values) => {
        try {
            if (!client || !client._id) {
                message.error("Не удалось получить ID клиента. Обновление невозможно.");
                return;
            }

            const payload = {
                ...values,
                serviceIds: values.serviceIds.map((id) => {
                    const service = services.find((service) => service._id === id);
                    return service ? { id: service._id, name: service.name } : null;
                }).filter(Boolean), // убираем null если сервис не найден

                additionalServiceIds: values.additionalServiceIds.map((id) => {
                    const service = services.find((service) => service._id === id);
                    return service ? { id: service._id, name: service.name } : null;
                }).filter(Boolean), // убираем null если сервис не найден

                birthDate: values.birthDate ? values.birthDate.toISOString() : null,
                firstAppointmentDate: values.firstAppointmentDate ? values.firstAppointmentDate.toISOString() : null,
                nextAppointmentDate: values.nextAppointmentDate ? values.nextAppointmentDate.toISOString() : null,
                childrenAge: values.childrenAge ? values.childrenAge.map(Number) : [],
            };

            console.log("Payload отправляется на сервер:", payload);

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
    return (
        <Modal
            title={isEditMode ? 'Редактирование данных клиента' : 'Добавление нового клиента'}
            open={isVisible}
            onCancel={onClose}
            footer={null}
            className="custom-modal"
        >
            <div style={{maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px'}}>

                <Form form={form} layout='vertical' onFinish={handleSubmit} className="custom-form">
                    <Form.Item label='Имя' name='firstName'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='Фамилия' name='lastName'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='Телефон' name='phone'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='Почта' name='email'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='Telegram' name='telegram'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='WhatsApp' name='whatsapp'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='Дата рождения' name='birthDate'>
                        <DatePicker format="DD.MM.YYYY" style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label='Заметки' name='notes'>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item label='Комментарии' name='comments'>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item label='Количество детей' name='childrenCount'>
                        <Input type="number"/>
                    </Form.Item>
                    <Form.Item label='Возраст детей' name='childrenAge'>
                        <Select mode='tags' placeholder='Введите возраст детей'/>
                    </Form.Item>
                    <Form.Item label='Дата записи' name='firstAppointmentDate'>
                        <DatePicker format="DD.MM.YYYY" style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label='Следующая запись' name='nextAppointmentDate'>
                        <DatePicker format="DD.MM.YYYY" style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item label='Основные услуги' name='serviceIds'>
                        <Select mode='multiple' placeholder='Выберите услуги'>
                            {services.map((service) => (
                                <Option key={service._id} value={service._id}>
                                    {service.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label='Дополнительные услуги' name='additionalServiceIds'>
                        <Select mode='multiple' placeholder='Выберите дополнительные услуги'>
                            {services.map((service) => (
                                <Option key={service._id} value={service._id}>
                                    {service.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item>
                        <Button type='primary' htmlType='submit' block>
                            {isEditMode ? 'Сохранить' : 'Добавить клиента'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
);
};

export default ClientModal;
