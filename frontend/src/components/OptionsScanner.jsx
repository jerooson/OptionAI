import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Select, Slider, Row, Col, message, Tag, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ReloadOutlined,
  ClearOutlined,
  WarningOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Option } = Select;

const OptionsScanner = () => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [filters, setFilters] = useState({
    ticker: '',
    minIvRank: 0,
    maxIvRank: 100,
    minReturn: 0,
    maxReturn: 100,
    minDaysToExpiry: 0,
    maxDaysToExpiry: 60,
    minVolume: 0,
    sector: '',
    sortBy: 'returnOnMargin',
    sortOrder: 'desc'
  });

  // Extended mock data for scanner
  const mockOptionsData = [
    {
      ticker: 'AAPL',
      strike: 165,
      stockPrice: 175.50,
      premium: 1.25,
      returnOnMargin: 28.5,
      ivRank: 72.3,
      daysToExpiry: 14,
      volume: 1250,
      openInterest: 5600,
      sector: 'Technology',
      delta: -0.15,
      key: 'AAPL-165-14',
      earningsDate: '2024-01-25',
      daysToEarnings: 11,
      earningsRisk: 'medium'
    },
    {
      ticker: 'TSLA',
      strike: 200,
      stockPrice: 220.80,
      premium: 2.85,
      returnOnMargin: 31.2,
      ivRank: 85.1,
      daysToExpiry: 21,
      volume: 2100,
      openInterest: 8900,
      sector: 'Consumer Discretionary',
      delta: -0.12,
      key: 'TSLA-200-21',
      earningsDate: '2024-01-18',
      daysToEarnings: 4,
      earningsRisk: 'high'
    },
    {
      ticker: 'NVDA',
      strike: 450,
      stockPrice: 485.20,
      premium: 5.50,
      returnOnMargin: 26.8,
      ivRank: 68.9,
      daysToExpiry: 30,
      volume: 1800,
      openInterest: 7200,
      sector: 'Technology',
      delta: -0.18,
      key: 'NVDA-450-30',
      earningsDate: '2024-02-15',
      daysToEarnings: 32,
      earningsRisk: 'low'
    },
    {
      ticker: 'META',
      strike: 280,
      stockPrice: 305.15,
      premium: 3.20,
      returnOnMargin: 24.1,
      ivRank: 61.5,
      daysToExpiry: 28,
      volume: 950,
      openInterest: 4300,
      sector: 'Technology',
      delta: -0.22,
      key: 'META-280-28',
      earningsDate: '2024-01-24',
      daysToEarnings: 10,
      earningsRisk: 'medium'
    },
    {
      ticker: 'MSFT',
      strike: 320,
      stockPrice: 340.90,
      premium: 2.95,
      returnOnMargin: 22.7,
      ivRank: 55.8,
      daysToExpiry: 35,
      volume: 1150,
      openInterest: 6800,
      sector: 'Technology',
      delta: -0.19,
      key: 'MSFT-320-35',
      earningsDate: '2024-02-20',
      daysToEarnings: 37,
      earningsRisk: 'low'
    },
    {
      ticker: 'GOOGL',
      strike: 130,
      stockPrice: 142.50,
      premium: 1.80,
      returnOnMargin: 19.5,
      ivRank: 48.2,
      daysToExpiry: 42,
      volume: 820,
      openInterest: 3200,
      sector: 'Technology',
      delta: -0.25,
      key: 'GOOGL-130-42',
      earningsDate: '2024-02-28',
      daysToEarnings: 45,
      earningsRisk: 'low'
    },
    {
      ticker: 'AMZN',
      strike: 140,
      stockPrice: 155.30,
      premium: 2.10,
      returnOnMargin: 17.8,
      ivRank: 52.7,
      daysToExpiry: 45,
      volume: 1320,
      openInterest: 5900,
      sector: 'Consumer Discretionary',
      delta: -0.16,
      key: 'AMZN-140-45',
      earningsDate: '2024-01-16',
      daysToEarnings: 2,
      earningsRisk: 'high'
    },
    {
      ticker: 'JPM',
      strike: 145,
      stockPrice: 158.90,
      premium: 1.65,
      returnOnMargin: 15.2,
      ivRank: 41.3,
      daysToExpiry: 28,
      volume: 750,
      openInterest: 2800,
      sector: 'Financial Services',
      delta: -0.21,
      key: 'JPM-145-28',
      earningsDate: '2024-02-10',
      daysToEarnings: 27,
      earningsRisk: 'low'
    }
  ];

  useEffect(() => {
    // Simulate initial data load
    setLoading(true);
    setTimeout(() => {
      setOptions(mockOptionsData);
      setFilteredOptions(mockOptionsData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters whenever filters change
    applyFilters();
  }, [filters, options]);

  const applyFilters = () => {
    let filtered = [...options];

    // Apply filters
    if (filters.ticker) {
      filtered = filtered.filter(option => 
        option.ticker.toLowerCase().includes(filters.ticker.toLowerCase())
      );
    }

    filtered = filtered.filter(option => 
      option.ivRank >= filters.minIvRank &&
      option.ivRank <= filters.maxIvRank &&
      option.returnOnMargin >= filters.minReturn &&
      option.returnOnMargin <= filters.maxReturn &&
      option.daysToExpiry >= filters.minDaysToExpiry &&
      option.daysToExpiry <= filters.maxDaysToExpiry &&
      option.volume >= filters.minVolume &&
      (!filters.sector || option.sector === filters.sector)
    );

    // Sort results
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];
      
      if (filters.sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    setFilteredOptions(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      ticker: '',
      minIvRank: 0,
      maxIvRank: 100,
      minReturn: 0,
      maxReturn: 100,
      minDaysToExpiry: 0,
      maxDaysToExpiry: 60,
      minVolume: 0,
      sector: '',
      sortBy: 'returnOnMargin',
      sortOrder: 'desc'
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

  const getDeltaClass = (delta) => {
    const absDelta = Math.abs(delta);
    if (absDelta <= 0.15) return 'delta-safe';
    if (absDelta <= 0.25) return 'delta-moderate';
    return 'delta-risky';
  };

  const getEarningsRiskColor = (daysToEarnings) => {
    if (daysToEarnings <= 7) return 'red';
    if (daysToEarnings <= 14) return 'orange';
    return 'green';
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
      width: 80,
      fixed: 'left'
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
      title: 'Days',
      dataIndex: 'daysToExpiry',
      key: 'daysToExpiry',
      render: (days) => `${days}d`,
      sorter: (a, b) => a.daysToExpiry - b.daysToExpiry,
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
      sorter: (a, b) => a.volume - b.volume,
      width: 80
    },
    {
      title: 'OI',
      dataIndex: 'openInterest',
      key: 'openInterest',
      render: (oi) => oi.toLocaleString(),
      width: 80
    },
    {
      title: 'Sector',
      dataIndex: 'sector',
      key: 'sector',
      width: 140
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SearchOutlined style={{ color: '#1890ff' }} />
          Options Scanner
          <Button 
            icon={<ReloadOutlined />} 
            onClick={applyFilters}
            loading={loading}
            style={{ marginLeft: 'auto' }}
          >
            Refresh
          </Button>
        </h1>
        <p style={{ color: '#8c8c8c', margin: '8px 0 0 0' }}>
          Advanced filtering and screening for premium option selling opportunities
        </p>
      </div>

      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FilterOutlined />
            Filters & Search
          </div>
        }
        extra={
          <Button 
            icon={<ClearOutlined />} 
            onClick={clearFilters}
            size="small"
          >
            Clear All
          </Button>
        }
        className="filters-section"
        style={{ marginBottom: 20 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div className="filter-item">
              <label>Ticker Symbol</label>
              <Input
                placeholder="e.g., AAPL"
                value={filters.ticker}
                onChange={(e) => handleFilterChange('ticker', e.target.value)}
                allowClear
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="filter-item">
              <label>Sector</label>
              <Select
                placeholder="Select sector"
                value={filters.sector}
                onChange={(value) => handleFilterChange('sector', value)}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="Technology">Technology</Option>
                <Option value="Financial Services">Financial Services</Option>
                <Option value="Consumer Discretionary">Consumer Discretionary</Option>
                <Option value="Healthcare">Healthcare</Option>
                <Option value="Energy">Energy</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="filter-item">
              <label>Sort By</label>
              <Select
                value={filters.sortBy}
                onChange={(value) => handleFilterChange('sortBy', value)}
                style={{ width: '100%' }}
              >
                <Option value="returnOnMargin">Return %</Option>
                <Option value="ivRank">IV Rank</Option>
                <Option value="volume">Volume</Option>
                <Option value="daysToExpiry">Days to Expiry</Option>
                <Option value="daysToEarnings">Days to Earnings</Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="filter-item">
              <label>Sort Order</label>
              <Select
                value={filters.sortOrder}
                onChange={(value) => handleFilterChange('sortOrder', value)}
                style={{ width: '100%' }}
              >
                <Option value="desc">Descending</Option>
                <Option value="asc">Ascending</Option>
              </Select>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <div className="filter-item">
              <label>IV Rank Range: {filters.minIvRank}% - {filters.maxIvRank}%</label>
              <Slider
                range
                min={0}
                max={100}
                value={[filters.minIvRank, filters.maxIvRank]}
                onChange={(value) => {
                  handleFilterChange('minIvRank', value[0]);
                  handleFilterChange('maxIvRank', value[1]);
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="filter-item">
              <label>Return Range: {filters.minReturn}% - {filters.maxReturn}%</label>
              <Slider
                range
                min={0}
                max={100}
                value={[filters.minReturn, filters.maxReturn]}
                onChange={(value) => {
                  handleFilterChange('minReturn', value[0]);
                  handleFilterChange('maxReturn', value[1]);
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="filter-item">
              <label>Days to Expiry: {filters.minDaysToExpiry} - {filters.maxDaysToExpiry}</label>
              <Slider
                range
                min={0}
                max={60}
                value={[filters.minDaysToExpiry, filters.maxDaysToExpiry]}
                onChange={(value) => {
                  handleFilterChange('minDaysToExpiry', value[0]);
                  handleFilterChange('maxDaysToExpiry', value[1]);
                }}
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div className="filter-item">
              <label>Min Volume: {filters.minVolume}</label>
              <Slider
                min={0}
                max={5000}
                step={100}
                value={filters.minVolume}
                onChange={(value) => handleFilterChange('minVolume', value)}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Card 
        title={`📊 Scan Results (${filteredOptions.length} options found)`}
        style={{ background: '#1f1f1f', border: '1px solid #303030' }}
        headStyle={{ background: '#1f1f1f', borderBottom: '1px solid #303030', color: '#fff' }}
        bodyStyle={{ background: '#1f1f1f' }}
      >
        <Table
          columns={columns}
          dataSource={filteredOptions}
          rowKey="key"
          loading={loading}
          pagination={{ 
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} options`
          }}
          className="options-table"
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default OptionsScanner; 