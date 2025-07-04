import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import Sidebar from './components/Navbar';
import Dashboard from './components/Dashboard';
import OptionsScanner from './components/OptionsScanner';
import OptionChain from './components/OptionChain';
import Chat from './components/Chat';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorBgContainer: '#1f1f1f',
          colorBgElevated: '#262626',
          colorBorder: '#434343',
          colorText: '#ffffff',
          colorTextSecondary: '#8c8c8c',
        },
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh', background: '#0f0f0f', display: 'flex' }}>
          <Sidebar />
          <Layout style={{ 
            marginLeft: 240, 
            flex: 1, 
            width: 'calc(100vw - 240px)',
            minWidth: 0
          }}>
            <Content style={{ 
              padding: '24px',
              background: '#0f0f0f',
              minHeight: '100vh',
              width: '100%',
              maxWidth: 'none',
              overflow: 'auto'
            }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/scanner" element={<OptionsScanner />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chain/:ticker" element={<OptionChain />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
