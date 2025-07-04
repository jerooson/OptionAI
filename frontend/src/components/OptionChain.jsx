import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Table, Button, Select, Tag, Statistic, Row, Col, message } from 'antd';
import { 
  LineChartOutlined, 
  ArrowLeftOutlined, 
  ReloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;

const OptionChain = () => {
  const { ticker } = useParams();
  const [loading, setLoading] = useState(true);
  const [optionChain, setOptionChain] = useState([]);
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const [stockInfo, setStockInfo] = useState({});
  const [expiryDates, setExpiryDates] = useState([]);

  // Mock data for option chain
  const mockOptionChainData = {
    'AAPL': {
      stockPrice: 175.50,
      sector: 'Technology',
      marketCap: '2.8T',
      volume: 45000000,
      options: [
        {
          expiry: '2024-01-15',
          strike: 160,
          premium: 2.15,
          bid: 2.10,
          ask: 2.20,
          volume: 1850,
          openInterest: 8200,
          ivRank: 68.5,
          delta: -0.18,
          returnOnMargin: 32.1,
          key: 'AAPL-160-2024-01-15'
        },
        {
          expiry: '2024-01-15',
          strike: 165,
          premium: 1.25,
          bid: 1.20,
          ask: 1.30,
          volume: 1250,
          openInterest: 5600,
          ivRank: 72.3,
          delta: -0.15,
          returnOnMargin: 28.5,
          key: 'AAPL-165-2024-01-15'
        },
        {
          expiry: '2024-01-15',
          strike: 170,
          premium: 0.85,
          bid: 0.80,
          ask: 0.90,
          volume: 980,
          openInterest: 3400,
          ivRank: 75.8,
          delta: -0.12,
          returnOnMargin: 24.2,
          key: 'AAPL-170-2024-01-15'
        },
        {
          expiry: '2024-01-22',
          strike: 160,
          premium: 2.85,
          bid: 2.80,
          ask: 2.90,
          volume: 2100,
          openInterest: 9500,
          ivRank: 71.2,
          delta: -0.20,
          returnOnMargin: 35.8,
          key: 'AAPL-160-2024-01-22'
        },
        {
          expiry: '2024-01-22',
          strike: 165,
          premium: 1.95,
          bid: 1.90,
          ask: 2.00,
          volume: 1650,
          openInterest: 7200,
          ivRank: 74.1,
          delta: -0.17,
          returnOnMargin: 31.4,
          key: 'AAPL-165-2024-01-22'
        },
        {
          expiry: '2024-01-22',
          strike: 170,
          premium: 1.35,
          bid: 1.30,
          ask: 1.40,
          volume: 1320,
          openInterest: 5800,
          ivRank: 77.5,
          delta: -0.14,
          returnOnMargin: 27.9,
          key: 'AAPL-170-2024-01-22'
        }
      ]
    },
    'TSLA': {
      stockPrice: 220.80,
      sector: 'Consumer Discretionary',
      marketCap: '700B',
      volume: 32000000,
      options: [
        {
          expiry: '2024-01-15',
          strike: 200,
          premium: 2.85,
          bid: 2.80,
          ask: 2.90,
          volume: 2100,
          openInterest: 8900,
          ivRank: 85.1,
          delta: -0.12,
          returnOnMargin: 31.2,
          key: 'TSLA-200-2024-01-15'
        },
        {
          expiry: '2024-01-15',
          strike: 210,
          premium: 1.95,
          bid: 1.90,
          ask: 2.00,
          volume: 1650,
          openInterest: 6200,
          ivRank: 82.7,
          delta: -0.08,
          returnOnMargin: 26.8,
          key: 'TSLA-210-2024-01-15'
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate API call to fetch option chain
    setLoading(true);
    setTimeout(() => {
      const data = mockOptionChainData[ticker.toUpperCase()];
      if (data) {
        setStockInfo({
          ticker: ticker.toUpperCase(),
          price: data.stockPrice,
          sector: data.sector,
          marketCap: data.marketCap,
          volume: data.volume
        });
        setOptionChain(data.options);
        
        // Extract unique expiry dates
        const expiries = [...new Set(data.options.map(option => option.expiry))].sort();
        setExpiryDates(expiries);
        setSelectedExpiry(expiries[0] || '');
      }
      setLoading(false);
    }, 1000);
  }, [ticker]);

  const getFilteredOptions = () => {
    if (!selectedExpiry) return optionChain;
    return optionChain.filter(option => option.expiry === selectedExpiry);
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

  const getDeltaClass = (delta) => {
    const absDelta = Math.abs(delta);
    if (absDelta <= 0.15) return 'delta-safe';
    if (absDelta <= 0.25) return 'delta-moderate';
    return 'delta-risky';
  };

  const columns = [
    {
      title: 'Strike',
      dataIndex: 'strike',
      key: 'strike',
      render: (strike) => (
        <span style={{ fontWeight: 'bold' }}>${strike}</span>
      ),
      width: 80
    },
    {
      title: 'Premium',
      dataIndex: 'premium',
      key: 'premium',
      render: (premium) => `$${premium}`,
      width: 80
    },
    {
      title: 'Bid/Ask',
      key: 'bidAsk',
      render: (_, record) => (
        <span>
          ${record.bid} / ${record.ask}
        </span>
      ),
      width: 100
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
      sorter: (a, b) => a.ivRank - b.ivRank,
      width: 90
    },
    {
      title: 'Delta',
      dataIndex: 'delta',
      key: 'delta',
      render: (delta) => (
        <span className={getDeltaClass(delta)}>
          {delta.toFixed(2)}
        </span>
      ),
      width: 80
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume) => volume.toLocaleString(),
      sorter: (a, b) => a.volume - b.volume,
      width: 80
    },
    {
      title: 'Open Interest',
      dataIndex: 'openInterest',
      key: 'openInterest',
      render: (oi) => oi.toLocaleString(),
      sorter: (a, b) => a.openInterest - b.openInterest,
      width: 120
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small"
          style={{ fontSize: '11px' }}
        >
          Analyze
        </Button>
      ),
      width: 80
    }
  ];

  if (!stockInfo.ticker) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2 style={{ color: '#fff' }}>Loading option chain for {ticker.toUpperCase()}...</h2>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 16 }}>
          <Link to="/scanner">
            <Button icon={<ArrowLeftOutlined />} size="small">
              Back to Scanner
            </Button>
          </Link>
          <h1 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LineChartOutlined style={{ color: '#1890ff' }} />
            {stockInfo.ticker} Option Chain
            <Button 
              icon={<ReloadOutlined />} 
              loading={loading}
              style={{ marginLeft: 'auto' }}
            >
              Refresh
            </Button>
          </h1>
        </div>
      </div>

      {/* Stock Information */}
      <Card 
        title={`📈 ${stockInfo.ticker} Stock Information`}
        style={{ background: '#1f1f1f', border: '1px solid #303030', marginBottom: 20 }}
        headStyle={{ background: '#1f1f1f', borderBottom: '1px solid #303030', color: '#fff' }}
        bodyStyle={{ background: '#1f1f1f' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Statistic
              title="Stock Price"
              value={stockInfo.price}
              prefix="$"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Sector"
              value={stockInfo.sector}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Market Cap"
              value={stockInfo.marketCap}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col xs={12} sm={6}>
            <Statistic
              title="Volume"
              value={stockInfo.volume}
              formatter={(value) => value.toLocaleString()}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Option Chain */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', justify: 'space-between' }}>
            <span>🔗 Put Options Chain</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8c8c8c', fontSize: '14px' }}>Expiry Date:</span>
              <Select
                value={selectedExpiry}
                onChange={setSelectedExpiry}
                style={{ width: 150 }}
                size="small"
              >
                <Option value="">All Expiries</Option>
                {expiryDates.map(date => (
                  <Option key={date} value={date}>{date}</Option>
                ))}
              </Select>
            </div>
          </div>
        }
        extra={
          <Tag icon={<InfoCircleOutlined />} color="blue">
            Cash-Secured Puts
          </Tag>
        }
        style={{ background: '#1f1f1f', border: '1px solid #303030' }}
        headStyle={{ background: '#1f1f1f', borderBottom: '1px solid #303030', color: '#fff' }}
        bodyStyle={{ background: '#1f1f1f' }}
      >
        <Table
          columns={columns}
          dataSource={getFilteredOptions()}
          rowKey="key"
          loading={loading}
          pagination={{ 
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} options`
          }}
          className="options-table"
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Trading Notes */}
      <Card 
        title="💡 Trading Notes"
        style={{ background: '#1f1f1f', border: '1px solid #303030', marginTop: 20 }}
        headStyle={{ background: '#1f1f1f', borderBottom: '1px solid #303030', color: '#fff' }}
        bodyStyle={{ background: '#1f1f1f' }}
      >
        <div style={{ color: '#8c8c8c', lineHeight: '1.6' }}>
          <p><strong style={{ color: '#52c41a' }}>Cash-Secured Puts:</strong> Selling puts requires holding cash equal to 100 shares × strike price.</p>
          <p><strong style={{ color: '#faad14' }}>IV Rank:</strong> Higher IV Rank (70%+) indicates better premium collection opportunities.</p>
          <p><strong style={{ color: '#1890ff' }}>Delta:</strong> Lower absolute delta (-0.15 or higher) indicates safer out-of-the-money positions.</p>
          <p><strong style={{ color: '#ff4d4f' }}>Risk:</strong> You may be assigned shares if the stock price falls below the strike price at expiration.</p>
        </div>
      </Card>
    </div>
  );
};

export default OptionChain; 