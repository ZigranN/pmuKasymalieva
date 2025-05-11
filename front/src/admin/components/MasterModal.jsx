import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { clearMessages } from "../features/masters/masterSlice";
import { createMaster, updateMaster } from "../features/masters/masterThunks";
import { fetchServices } from "../features/services/servicesThunks";
import {
    selectServices,
    selectServicesError,
    selectServicesFetchLoading,
    selectServicesSuccess
} from "../features/services/servicesSlice.js";
import { useAppDispatch, useAppSelector } from "../../app/hooks.js";

const UploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 15px;
`;

const MasterModal = ({ isOpen, onClose, master }) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const services = useAppSelector(selectServices);
    const isServicesLoading = useAppSelector(selectServicesFetchLoading);
    const error = useAppSelector(selectServicesError);
    const success = useAppSelector(selectServicesSuccess);

    const isEdit = Boolean(master);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (services.length === 0) {
            dispatch(fetchServices());
        }
    }, [dispatch, services.length]);

    useEffect(() => {
        if (isEdit) {

            const formattedServices = master.services.map(serviceName => {
                const foundService = services.find(s => s.name === serviceName);
                return foundService ? foundService._id : null;
            }).filter(Boolean);

            console.log("✅ Сопоставленные ID:", formattedServices);

            form.setFieldsValue({
                name: master.name,
                phoneNumber: master.phoneNumber,
                email: master.email,
                services: formattedServices,
            });
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [isEdit, master, form, services]);

    useEffect(() => {
        if (success || error) {
            setTimeout(() => {
                dispatch(clearMessages());
            }, 3000);
        }
    }, [success, error, dispatch]);

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleFinish = (values) => {
        if (fileList.length > 0) {
            if (fileList[0].originFileObj) {
                values.photo = fileList[0].originFileObj;
            }
        }

        if (isEdit) {
            dispatch(updateMaster({ id: master._id, masterData: values }))
                .unwrap()
                .then(() => {
                    message.success('Мастер успешно обновлён');
                    onClose();
                })
                .catch((err) => {
                    message.error(`Ошибка при обновлении: ${err}`);
                });
        } else {
            dispatch(createMaster(values))
                .unwrap()
                .then(() => {
                    message.success('Мастер успешно добавлен');
                    onClose();
                })
                .catch((err) => {
                    message.error(`Ошибка при добавлении: ${err}`);
                });
        }
    };

    return (
        <Modal
            open={isOpen}
            title={isEdit ? "Редактировать мастера" : "Создать мастера"}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    name="name"
                    label="Имя"
                    rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
                >
                    <Input placeholder="Введите имя мастера" />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Телефон"
                    rules={[{ required: true, message: 'Пожалуйста, введите номер телефона' }]}
                >
                    <Input placeholder="Введите номер телефона" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: 'Пожалуйста, введите email' }]}
                >
                    <Input placeholder="Введите email" />
                </Form.Item>

                <Form.Item
                    name="services"
                    label="Услуги"
                    rules={[{ required: true, message: 'Пожалуйста, выберите услуги' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Выберите услуги"
                        options={services.map((service) => ({
                            value: service._id,
                            label: service.name
                        }))}
                        autoClearSearchValue={true}
                        onChange={() => {
                            document.activeElement.blur();
                        }}
                    />
                </Form.Item>

                <UploadContainer>
                    <Upload
                        listType="picture"
                        maxCount={1}
                        beforeUpload={() => false}
                        onChange={handleUploadChange}
                        fileList={fileList}
                    >
                        <Button icon={<UploadOutlined />}>Загрузить фото</Button>
                    </Upload>
                </UploadContainer>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={isServicesLoading} block>
                        {isEdit ? 'Сохранить изменения' : 'Создать мастера'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MasterModal;
