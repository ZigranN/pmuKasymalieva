import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Tooltip, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import AddClientModal from "../components/AddClientModal.jsx";
import EditClientModal from "../components/EditClientModal.jsx";
import { deleteUser, fetchUsers } from "../features/users/usersThunk.js";
import './../styles/ClientsListPage.css';

const ClientsListPage = () => {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.users);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isClientModalVisible, setIsClientModalVisible] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Удалить клиента',
            content: 'Вы уверены, что хотите удалить клиента?',
            okText: 'Удалить',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await dispatch(deleteUser(id));
                    await dispatch(fetchUsers());
                    message.success('Клиент успешно удалён');
                } catch (error) {
                    message.error('Ошибка при удалении клиента');
                }
            },
        });
    };

    const handleEdit = (client) => {
        setSelectedClient(client);
        setIsEditModalVisible(true);
    };

    const handleAddClient = () => {
        setIsAddModalVisible(true);
    };

    const closeModals = () => {
        setIsEditModalVisible(false);
        setIsAddModalVisible(false);
        setIsClientModalVisible(false);
        setSelectedClient(null);
    };

    const handleClientInfo = (client) => {
        setSelectedClient(client);
        setIsClientModalVisible(true);
    };

    const columns = [
        {
            title: 'Имя',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Фамилия',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Телефон',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Почта',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Дата записи',
            dataIndex: 'firstAppointmentDate',
            key: 'firstAppointmentDate',
            render: (date) => (date ? dayjs(date).format('DD.MM.YYYY') : '-'),
            sorter: (a, b) => new Date(a.firstAppointmentDate) - new Date(b.firstAppointmentDate),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space size='middle'>
                    <Tooltip title="Информация">
                        <Button
                            icon={<InfoCircleOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClientInfo(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Редактировать">
                        <Button
                            type='primary'
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(record._id);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="clients-list-container">
            <Button type='primary' style={{ marginBottom: 16 }} onClick={handleAddClient}>
                Добавить клиента
            </Button>

            {loading ? (
                <Spin size='large' />
            ) : error ? (
                <Alert message='Ошибка загрузки данных' description={error} type='error' showIcon />
            ) : (
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey='_id'
                    pagination={{ pageSize: 10 }}
                    rowClassName="custom-row"
                />
            )}

            {isEditModalVisible && (
                <EditClientModal
                    isVisible={isEditModalVisible}
                    onClose={closeModals}
                    client={selectedClient}
                />
            )}

            {isAddModalVisible && (
                <AddClientModal
                    isVisible={isAddModalVisible}
                    onClose={closeModals}
                />
            )}

            {isClientModalVisible && selectedClient && (
                <Modal
                    title={` ${selectedClient.firstName} ${selectedClient.lastName}`}
                    open={isClientModalVisible}
                    footer={null}
                    onCancel={closeModals}
                    className="client-info-modal"

                >
                    <p><b>Телефон:</b> {selectedClient.phone}</p>
                    <p><b>Почта:</b> {selectedClient.email}</p>
                    <p><b>Telegram:</b> {selectedClient.telegram || '-'}</p>
                    <p><b>WhatsApp:</b> {selectedClient.whatsapp || '-'}</p>
                    <p><b>Дата рождения:</b> {selectedClient.birthDate ? dayjs(selectedClient.birthDate).format('DD.MM.YYYY') : '-'}</p>
                    <p><b>Заметки:</b> {selectedClient.notes || '-'}</p>
                    <p><b>Комментарии:</b> {selectedClient.comments || '-'}</p>
                    <p><b>Количество детей:</b> {selectedClient.childrenCount || '-'}</p>
                    <p><b>Возраст детей:</b> {selectedClient.childrenAge?.join(', ') || '-'}</p>
                    <p><b>Дата записи:</b> {selectedClient.firstAppointmentDate ? dayjs(selectedClient.firstAppointmentDate).format('DD.MM.YYYY') : '-'}</p>
                    <p><b>Следующая запись:</b> {selectedClient.nextAppointmentDate ? dayjs(selectedClient.nextAppointmentDate).format('DD.MM.YYYY') : '-'}</p>
                    <p><b>Услуги:</b> {selectedClient.serviceIds?.map((service) => service.name).join(', ') || '-'}</p>
                    <p><b>Дополнительные услуги:</b> {selectedClient.additionalServiceIds?.map((service) => service.name).join(', ') || '-'}</p>
                </Modal>
            )}
        </div>
    );
};

export default ClientsListPage;
