import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Tooltip, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    fetchServices,
    deleteService
} from "../features/services/servicesThunks";
import {
    selectServices,
    selectServicesError,
    selectServicesFetchLoading,
    selectServicesSuccess
} from "../features/services/servicesSlice";
import ServiceModal from "../components/ServiceModal";

const ServicesListPage = () => {
    const dispatch = useAppDispatch();

    // ✅ Селекторы из Redux
    const services = useAppSelector(selectServices);
    const isLoading = useAppSelector(selectServicesFetchLoading);
    const error = useAppSelector(selectServicesError);
    const success = useAppSelector(selectServicesSuccess);

    // ✅ Состояния модалки и выбранной услуги
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // ✅ Загрузка списка услуг при монтировании
    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    // ✅ Обработка удаления услуги
    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Удалить услугу',
            content: 'Вы уверены, что хотите удалить услугу?',
            okText: 'Удалить',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await dispatch(deleteService(id)).unwrap();
                    message.success('Услуга успешно удалена');
                } catch (error) {
                    console.error(error.message);
                    message.error('Ошибка при удалении услуги');
                }
            },
        });
    };

    // ✅ Открытие модалки в режиме редактирования
    const handleEdit = (service) => {
        setSelectedService(service);
        setIsModalVisible(true);
    };

    // ✅ Открытие модалки в режиме создания
    const handleAddService = () => {
        setSelectedService(null);
        setIsModalVisible(true);
    };

    // ✅ Закрытие модалки
    const closeModal = () => {
        setSelectedService(null);
        setIsModalVisible(false);
    };

    // ✅ Колонки для таблицы
    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Цена (сом)',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price} сом`,
        },
        {
            title: 'Длительность (мин)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space size='middle'>
                    <Tooltip title="Редактировать">
                        <Button
                            type='primary'
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Удалить">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record._id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (isLoading) {
        return <Spin size="large" style={{ margin: "20px auto", display: "block" }} />;
    }

    if (error) {
        message.error(`Ошибка при загрузке услуг: ${error}`);
    }

    if (success) {
        message.success(success);
    }

    return (
        <div>
            <Button
                type='primary'
                icon={<PlusOutlined />}
                style={{ marginBottom: 16 }}
                onClick={handleAddService}
            >
                Добавить услугу
            </Button>

            <Table
                columns={columns}
                dataSource={services}
                rowKey='_id'
                pagination={{ pageSize: 10 }}
            />

            {/* Модалка добавления/редактирования */}
            {isModalVisible && (
                <ServiceModal
                    isVisible={isModalVisible}
                    onClose={closeModal}
                    service={selectedService}
                />
            )}
        </div>
    );
};

export default ServicesListPage;
