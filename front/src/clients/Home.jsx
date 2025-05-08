import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Button = styled(Link)`
    display: inline-block;
    margin-top: 2rem;
    padding: 1rem 2rem;
    background-color: #202020;
    color: #fff;
    font-size: 1.2rem;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    margin: 0 auto;
    &:hover {
        background-color: #333333;
    }
`;

const Home = () => {
    return (
        <div style={{margin: '0 auto'}}>
            <h1>Главная страница</h1>
            <Button to="/admin">Перейти в Админ-панель</Button>
        </div>
    );
};

export default Home;
