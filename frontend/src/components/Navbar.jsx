import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  SearchOutlined, 
  LineChartOutlined,
  TrophyOutlined,
  MessageOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/scanner',
      icon: <SearchOutlined />,
      label: <Link to="/scanner">Scanner</Link>,
    },
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: <Link to="/chat">AI Chat</Link>,
    },
    {
      key: '/chain',
      icon: <LineChartOutlined />,
      label: 'Option Chains',
      disabled: true,
    },
  ];

  return (
    <Sider
      width={240}
      style={{
        background: '#141414',
        borderRight: '1px solid #303030',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo/Brand Section */}
      <div style={{
        padding: '24px 16px',
        borderBottom: '1px solid #303030',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '8px'
        }}>
          <TrophyOutlined style={{ 
            fontSize: '24px', 
            color: '#1890ff' 
          }} />
          <h2 style={{ 
            color: '#fff', 
            margin: 0,
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            Option AI
          </h2>
        </div>
        <p style={{ 
          color: '#8c8c8c', 
          margin: 0,
          fontSize: '12px'
        }}>
          Premium Options Trading
        </p>
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{
          background: 'transparent',
          border: 'none',
          paddingTop: '16px'
        }}
        theme="dark"
        items={menuItems}
      />

      {/* Footer Section */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        padding: '12px',
        background: '#262626',
        borderRadius: '6px',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: '#8c8c8c', 
          margin: 0,
          fontSize: '11px'
        }}>
          🤖 AI-Powered Trading
        </p>
        <p style={{ 
          color: '#52c41a', 
          margin: 0,
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          Chat with Expert AI
        </p>
      </div>
    </Sider>
  );
};

export default Sidebar; 