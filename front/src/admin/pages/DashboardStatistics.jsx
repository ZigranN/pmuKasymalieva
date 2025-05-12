import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Statistic, Row, Col } from "antd";
import axiosApi from "../../../axiosApi.js";

const DashboardStatistics = () => {
    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axiosApi.get("/api/admin/dashboard");
                setStats(data);
            } catch (error) {
                console.error("Ошибка загрузки статистики", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <Row gutter={16}>
            <Col span={6}>
                <Card>
                    <Statistic title="Всего записей" value={stats.totalAppointments} />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic title="Количество услуг" value={stats.totalServices} />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic title="Количество клиентов" value={stats.totalClients} />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic title="Свободные слоты" value={stats.availableSlots?.length} />
                </Card>
            </Col>
        </Row>
    );
};

export default DashboardStatistics;
