import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Tooltip, Spin, Alert } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";
import { fetchUsers, deleteUser } from "../features/users/usersThunk.js";
import {
    selectUsers,
    selectFetchLoading,
    selectUsersError,
    clearUserMessages
} from "../features/users/usersSlice.js";
import ClientModal from "../components/ClientModal.jsx";
import ClientInfoModal from "../components/ClientInfoModal.jsx";
import dayjs from 'dayjs';
import './../styles/ClientsListPage.css';

const ClientsListPage = () => {
    const dispatch = useAppDispatch();

    // ✅ Селекторы
    const users = useAppSelector(selectUsers);
    const loading = useAppSelector(selectFetchLoading);
    const error = useAppSelector(selectUsersError);

    // ✅ Состояния модалок
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // ✅ Первичная загрузка пользователей
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            message.error(`Ошибка при загрузке данных: ${error}`);
            dispatch(clearUserMessages());
        }
    }, [error, dispatch]);

    // ✅ Обработчики модалок
    const openEditModal = (client) => {
        setSelectedClient(client);
        setIsEditMode(true);
        setIsModalVisible(true);
    };

    const openAddModal = () => {
        setSelectedClient(null);
        setIsEditMode(false);
        setIsModalVisible(true);
    };

    const openInfoModal = (client) => {
        setSelectedClient(client);
        setIsInfoModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedClient(null);
        setIsEditMode(false);
    };

    const closeInfoModal = () => {
        setIsInfoModalVisible(false);
        setSelectedClient(null);
    };

    // ✅ Удаление клиента с подтверждением
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Удалить клиента',
            content: 'Вы уверены, что хотите удалить клиента?',
            okText: 'Удалить',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await dispatch(deleteUser(id)).unwrap();
                    message.success('Клиент успешно удалён');
                } catch (error) {
                    message.error('Ошибка при удалении клиента');
                }
            },
        });
    };

    // ✅ Описание колонок таблицы
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
                                openInfoModal(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Редактировать">
                        <Button
                            type='primary'
                            icon={<EditOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(record);
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

    // ✅ Рендер страницы
    return (
        <div className="clients-list-container">
            <Button
                type='primary'
                icon={<PlusOutlined />}
                style={{ marginBottom: 16 }}
                onClick={openAddModal}
            >
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

            {/* ✅ Модалка редактирования или создания */}
            {isModalVisible && (
                <ClientModal
                    isVisible={isModalVisible}
                    onClose={closeModal}
                    client={selectedClient}
                    isEditMode={isEditMode}
                />
            )}

            {/* ✅ Модалка просмотра информации */}
            {isInfoModalVisible && (
                <ClientInfoModal
                    isVisible={isInfoModalVisible}
                    onClose={closeInfoModal}
                    client={selectedClient}
                />
            )}
        </div>
    );
};

export default ClientsListPage;
