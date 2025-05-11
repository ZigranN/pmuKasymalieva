import React, {useEffect} from 'react';
import { Modal, Descriptions } from 'antd';
import dayjs from 'dayjs';
import {useAppDispatch, useAppSelector} from "../../app/hooks.js";
import { selectServices } from "../features/services/servicesSlice.js";
import {fetchServices} from "../features/services/servicesThunks.js";

const ClientInfoModal = ({ isVisible, onClose, client }) => {
    const dispatch = useAppDispatch();
    const services = useAppSelector(selectServices);

    useEffect(() => {
        if (services.length === 0) {
            dispatch(fetchServices());
        }
    }, [dispatch, services.length]);

    if (!client) {
        return null;
    }

    // 🔄 Маппинг основных услуг
    const mainServices = client.serviceIds.length > 0
        ? client.serviceIds.map((id) => {
            const service = services.find((s) => s._id === id);
            return service ? service.name : "Неизвестная услуга";
        }).join(', ')
        : 'Нет услуг';

    const additionalServices = client.additionalServiceIds.length > 0
        ? client.additionalServiceIds.map((id) => {
            const service = services.find((s) => s._id === id);
            return service ? service.name : "Неизвестная услуга";
        }).join(', ')
        : 'Нет дополнительных услуг';

    return (
        <Modal
            title={`Информация о клиенте: ${client.firstName} ${client.lastName}`}
            open={isVisible}
            onCancel={onClose}
            footer={null}
            className="custom-modal"
        >
            <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
                <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="Телефон">
                        {client.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Почта">
                        {client.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Telegram">
                        {client.telegram || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="WhatsApp">
                        {client.whatsapp || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дата рождения">
                        {client.birthDate ? dayjs(client.birthDate).format('DD.MM.YYYY') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Количество детей">
                        {client.childrenCount}
                    </Descriptions.Item>
                    <Descriptions.Item label="Возраст детей">
                        {client.childrenAge.length > 0 ? client.childrenAge.join(', ') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Заметки">
                        {client.notes || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Комментарии">
                        {client.comments || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дата записи">
                        {client.firstAppointmentDate ? dayjs(client.firstAppointmentDate).format('DD.MM.YYYY') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Следующая запись">
                        {client.nextAppointmentDate ? dayjs(client.nextAppointmentDate).format('DD.MM.YYYY') : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Основные услуги">
                        {mainServices}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дополнительные услуги">
                        {additionalServices}
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Modal>
    );
};

export default ClientInfoModal;
