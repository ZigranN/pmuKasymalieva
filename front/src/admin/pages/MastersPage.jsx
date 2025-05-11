import React, { useEffect, useState } from 'react';
import {Card, Button, message, Row, Col, Typography, Tooltip, Modal, Spin} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MasterModal from '../components/MasterModal';
import { fetchMasters, deleteMaster } from '../features/masters/masterThunks';
import {useAppDispatch, useAppSelector} from "../../app/hooks.js";
import {
    selectMasters,
    selectMastersError,
    selectMastersFetchLoading,
    selectMastersSuccess
} from "../features/masters/masterSlice.js";

const { Title, Text } = Typography;

const CardContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f5f5f5;
    padding: 10px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const MasterCard = styled(motion(Card))`
    width: 100%;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    background: linear-gradient(145deg, #ffffff, #e6e6e6);
    border: none;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
`;

const MasterImage = styled.img`
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 15px 15px 0 0;
`;

const AddButton = styled(Button)`
    background-color: #4CAF50;
    color: white;
    border-radius: 8px;
    border: none;
    transition: all 0.3s ease;

    &:hover {
        background-color: #45a049;
    }
`;

const MasterPage = () => {
    const dispatch = useAppDispatch();

    // ✅ Селекторы
    const masters = useAppSelector(selectMasters);
    const isLoading = useAppSelector(selectMastersFetchLoading);
    const error = useAppSelector(selectMastersError);
    const success = useAppSelector(selectMastersSuccess);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMaster, setSelectedMaster] = useState(null);

    useEffect(() => {
        dispatch(fetchMasters());
    }, [dispatch]);

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Вы уверены, что хотите удалить мастера?',
            content: 'Это действие необратимо.',
            okText: 'Удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await dispatch(deleteMaster(id)).unwrap();
                    message.success('Мастер успешно удалён');
                } catch (err) {
                    message.error(`Ошибка при удалении: ${err}`);
                }
            }
        });
    };

    const openModal = (master = null) => {
        setSelectedMaster(master);
        setIsModalOpen(true);
    };

    const closeModal = async () => {
        setSelectedMaster(null);
        setIsModalOpen(false);
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>;
    }

    if (error) {
        message.error(`Ошибка при загрузке мастеров: ${error}`);
    }


    return (
        <CardContainer>
            <Header>
                <Title level={3} style={{ color: '#333' }}>🌟 Наши мастера</Title>
                <AddButton icon={<PlusOutlined />} size="large" onClick={() => openModal()}>
                    Добавить мастера
                </AddButton>
            </Header>

            <Row gutter={[24, 24]} style={{ marginTop: '20px' }}>
                {masters.map((master) => (
                    <Col key={master._id} xs={24} sm={24} md={12} lg={8} xl={6}>
                        <MasterCard
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            cover={
                                master.photoUrl ? (
                                    <MasterImage src={master.photoUrl} alt={master.name} />
                                ) : (
                                    <MasterImage src="/default-user.png" alt="Нет фото" />
                                )
                            }
                            actions={[
                                <Tooltip title="Редактировать" key={`edit-${master._id}`}>
                                    <EditOutlined
                                        key="edit"
                                        style={{ color: '#1890ff' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(master);
                                        }}
                                    />
                                </Tooltip>,
                                <Tooltip title="Удалить" key={`delete-${master._id}`}>
                                    <DeleteOutlined
                                        key="delete"
                                        style={{ color: '#ff4d4f' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(master._id);
                                        }}
                                    />
                                </Tooltip>
                            ]}
                        >
                            <Card.Meta
                                title={<Title level={4} style={{ color: '#555' }}>{master.name}</Title>}
                                description={
                                    <div style={{ marginTop: '10px' }}>
                                        <Text strong>Телефон:</Text> <Text>{master.phoneNumber}</Text> <br />
                                        <Text strong>Email:</Text> <Text>{master.email}</Text> <br />
                                        <Text strong>Рейтинг:</Text> <Text>{master.rating}</Text> <br />
                                        <Text strong>Услуги:</Text>
                                        <Text>
                                            {Array.isArray(master.services) && master.services.length > 0
                                                ? master.services.join(', ')
                                                : "Нет услуг"
                                            }
                                        </Text> <br />
                                        <Text strong>Отзывы:</Text> <Text>{master.reviews?.length || 0}</Text>
                                    </div>
                                }
                            />
                        </MasterCard>
                    </Col>
                ))}
            </Row>
            {isModalOpen && (
                <MasterModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    master={selectedMaster}
                />
            )}
        </CardContainer>
    );
};

export default MasterPage;
