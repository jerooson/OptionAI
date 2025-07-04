import React, { useState, useEffect } from 'react';
import { Card, Table, Statistic, Button, message, Tag, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { 
  TrophyOutlined, 
  RiseOutlined, 
  FallOutlined,
  SearchOutlined,
  ReloadOutlined,
  WarningOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import axios from 'axios';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [bestOptions, setBestOptions] = useState([]);
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    avgReturn: 0,
    avgIvRank: 0,
    highReturnCount: 0
  });

  useEffect(() => {
    fetchBestOptions();
  }, []);

  const fetchBestOptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/options/best');
      if (response.data.success) {
        setBestOptions(response.data.data);
        calculateStats(response.data.data);
        message.success('Data loaded successfully');
      }
    } catch (error) {
      message.error('Failed to fetch best options');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (data.length === 0) return;
    
    const totalOpportunities = data.length;
    const avgReturn = data.reduce((sum, item) => sum + item.returnOnMargin, 0) / totalOpportunities;
    const avgIvRank = data.reduce((sum, item) => sum + item.ivRank, 0) / totalOpportunities;
    const highReturnCount = data.filter(item => item.returnOnMargin >= 25).length;
    
    setStats({
      totalOpportunities,
      avgReturn: avgReturn.toFixed(1),
      avgIvRank: avgIvRank.toFixed(1),
      highReturnCount
    });
  };

  const getReturnClass = (returnValue) => {
    if (returnValue >= 25) return 'return-high';
    if (returnValue >= 15) return 'return-medium';
    return 'return-low';
  };

  const getIvRankClass = (ivRank) => {
    if (ivRank >= 70) return 'iv-rank-high';
    if (ivRank >= 50) return 'iv-rank-medium';
    return 'iv-rank-low';
  };

  const getEarningsRiskColor = (daysToEarnings) => {
    if (daysToEarnings <= 7) return 'red';
    if (daysToEarnings <= 14) return 'orange';
    return 'green';
  };

  const getEarningsRiskText = (daysToEarnings) => {
    if (daysToEarnings <= 7) return 'HIGH RISK';
    if (daysToEarnings <= 14) return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  const getEarningsTooltip = (daysToEarnings, earningsDate) => {
    if (daysToEarnings <= 7) {
      return `⚠️ EARNINGS ALERT: ${daysToEarnings} days until earnings (${earningsDate}). High volatility and assignment risk expected. Consider closing position before earnings.`;
    }
    if (daysToEarnings <= 14) {
      return `⚡ Earnings in ${daysToEarnings} days (${earningsDate}). Monitor position closely as IV may increase leading up to earnings.`;
    }
    return `📅 Earnings in ${daysToEarnings} days (${earningsDate}). Relatively safe from earnings volatility.`;
  };

  const columns = [
    {
      title: 'Ticker',
      dataIndex: 'ticker',
      key: 'ticker',
      render: (ticker) => (
        <Link to={`/chain/${ticker}`} style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {ticker}
        </Link>
      ),
      width: 80
    },
    {
      title: 'Strike',
      dataIndex: 'strike',
      key: 'strike',
      render: (strike) => `$${strike}`,
      width: 80
    },
    {
      title: 'Stock Price',
      dataIndex: 'stockPrice',
      key: 'stockPrice',
      render: (price) => `$${price}`,
      width: 100
    },
    {
      title: 'Premium',
      dataIndex: 'premium',
      key: 'premium',
      render: (premium) => `$${premium}`,
      width: 80
    },
    {
      title: 'Return %',
      dataIndex: 'returnOnMargin',
      key: 'returnOnMargin',
      render: (returnValue) => (
        <span className={getReturnClass(returnValue)}>
          {returnValue.toFixed(1)}%
        </span>
      ),
      sorter: (a, b) => a.returnOnMargin - b.returnOnMargin,
      width: 90
    },
    {
      title: 'IV Rank',
      dataIndex: 'ivRank',
      key: 'ivRank',
      render: (ivRank) => (
        <span className={getIvRankClass(ivRank)}>
          {ivRank.toFixed(1)}%
        </span>
      ),
      width: 90
    },
    {
      title: 'Days',
      dataIndex: 'daysToExpiry',
      key: 'daysToExpiry',
      render: (days) => `${days}d`,
      width: 60
    },
    {
      title: 'Earnings Risk',
      key: 'earningsRisk',
      render: (_, record) => (
        <Tooltip title={getEarningsTooltip(record.daysToEarnings, record.earningsDate)} placement="top">
          <Tag 
            color={getEarningsRiskColor(record.daysToEarnings)}
            icon={record.daysToEarnings <= 7 ? <WarningOutlined /> : <CalendarOutlined />}
            style={{ cursor: 'help' }}
          >
            {record.daysToEarnings}d
          </Tag>
        </Tooltip>
      ),
      sorter: (a, b) => a.daysToEarnings - b.daysToEarnings,
      width: 100
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume) => volume.toLocaleString(),
      width: 80
    },
    {
      title: 'Sector',
      dataIndex: 'sector',
      key: 'sector',
      width: 120
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <TrophyOutlined style={{ color: '#1890ff' }} />
          Option AI Dashboard
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchBestOptions}
            loading={loading}
            style={{ marginLeft: 'auto' }}
          >
            Refresh
          </Button>
        </h1>
        <p style={{ color: '#8c8c8c', margin: '8px 0 0 0' }}>
          Premium option selling opportunities with high IV rank and attractive returns
        </p>
      </div>

      <div className="stats-cards">
        <Card className="stat-card">
          <Statistic
            title="Total Opportunities"
            value={stats.totalOpportunities}
            prefix={<SearchOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
        <Card className="stat-card">
          <Statistic
            title="Avg Return (Annual)"
            value={stats.avgReturn}
            suffix="%"
            prefix={<RiseOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
        <Card className="stat-card">
          <Statistic
            title="Avg IV Rank"
            value={stats.avgIvRank}
            suffix="%"
            prefix={<FallOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
        <Card className="stat-card">
          <Statistic
            title="High Return (25%+)"
            value={stats.highReturnCount}
            prefix={<TrophyOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </div>

      <Card 
        title="🏆 Best Option Selling Opportunities" 
        extra={
          <Link to="/scanner">
            <Button type="primary" icon={<SearchOutlined />}>
              Full Scanner
            </Button>
          </Link>
        }
        style={{ background: '#1f1f1f', border: '1px solid #303030' }}
        headStyle={{ background: '#1f1f1f', borderBottom: '1px solid #303030', color: '#fff' }}
        bodyStyle={{ background: '#1f1f1f' }}
      >
        <div style={{ marginBottom: 16, padding: '12px', background: '#2a2a2a', borderRadius: '6px', border: '1px solid #404040' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <WarningOutlined style={{ color: '#ff4d4f' }} />
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Earnings Risk Legend:</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Tag color="red" icon={<WarningOutlined />}>≤7 days - HIGH RISK</Tag>
            <Tag color="orange" icon={<CalendarOutlined />}>8-14 days - MEDIUM RISK</Tag>
            <Tag color="green" icon={<CalendarOutlined />}>15+ days - LOW RISK</Tag>
          </div>
          <p style={{ color: '#8c8c8c', margin: '8px 0 0 0', fontSize: '12px' }}>
            💡 Tip: Consider closing positions 1-2 days before earnings to avoid volatility crush and assignment risk.
          </p>
        </div>
        
        <Table
          columns={columns}
          dataSource={bestOptions}
          rowKey={(record) => `${record.ticker}-${record.strike}-${record.expiry}`}
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="options-table"
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default Dashboard; 