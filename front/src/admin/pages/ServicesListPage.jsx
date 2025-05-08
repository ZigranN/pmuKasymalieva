import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, message, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchServices, deleteService } from "../features/services/servicesThunks";
import EditServiceModal from "../components/EditServiceModal.jsx";
import AddServiceModal from "../components/AddServiceModal.jsx";


const ServicesListPage = () => {
    const dispatch = useDispatch();
    const { services, loading, error } = useSelector((state) => state.services);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Удалить услугу',
            content: 'Вы уверены, что хотите удалить услугу?',
            okText: 'Удалить',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await dispatch(deleteService(id));
                    message.success('Услуга успешно удалена');
                } catch (error) {
                    message.error('Ошибка при удалении услуги');
                }
            },
        });
    };

    const handleEdit = (service) => {
        setSelectedService(service);
        setIsEditModalVisible(true);
    };

    const handleAddService = () => {
        setIsAddModalVisible(true);
    };

    const closeModals = () => {
        setIsAddModalVisible(false);
        setIsEditModalVisible(false);
        setSelectedService(null);
    };

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
            render: (price) => `${price} сом`
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
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {isAddModalVisible && (
                <AddServiceModal isVisible={isAddModalVisible} onClose={closeModals} />
            )}

            {isEditModalVisible && selectedService && (
                <EditServiceModal isVisible={isEditModalVisible} onClose={closeModals} service={selectedService} />
            )}
        </div>
    );
};

export default ServicesListPage;
