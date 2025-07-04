const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for options
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
    expiry: '2024-01-15',
    type: 'put',
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
    expiry: '2024-01-22',
    type: 'put',
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
    expiry: '2024-01-29',
    type: 'put',
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
    expiry: '2024-01-27',
    type: 'put',
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
    expiry: '2024-02-03',
    type: 'put',
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
    expiry: '2024-02-05',
    type: 'put',
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
    expiry: '2024-02-08',
    type: 'put',
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
    expiry: '2024-01-30',
    type: 'put',
    earningsDate: '2024-02-10',
    daysToEarnings: 27,
    earningsRisk: 'low'
  }
];

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Option AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Get best options for selling
app.get('/api/options/best', (req, res) => {
  try {
    // Filter for best opportunities
    const bestOptions = mockOptionsData.filter(option => {
      return (
        option.ivRank >= 50 && // High IV Rank
        option.returnOnMargin >= 20 && // Good return
        option.volume >= 500 && // Decent volume
        option.openInterest >= 1000 // Good open interest
      );
    });

    // Sort by return on margin (descending)
    bestOptions.sort((a, b) => b.returnOnMargin - a.returnOnMargin);

    res.json({
      success: true,
      data: bestOptions,
      count: bestOptions.length,
      criteria: {
        minIvRank: 50,
        minReturn: 20,
        minVolume: 500,
        minOpenInterest: 1000
      }
    });
  } catch (error) {
    console.error('Error fetching best options:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch best options' });
  }
});

// Get options scan with filters
app.get('/api/options/scan', (req, res) => {
  try {
    const {
      minIvRank = 0,
      maxIvRank = 100,
      minReturn = 0,
      maxReturn = 1000,
      minDaysToExpiry = 0,
      maxDaysToExpiry = 365,
      minVolume = 0,
      minOpenInterest = 0,
      sector,
      ticker,
      sortBy = 'returnOnMargin',
      sortOrder = 'desc',
      limit = 50
    } = req.query;

    let filteredOptions = mockOptionsData.filter(option => {
      return (
        option.ivRank >= parseFloat(minIvRank) &&
        option.ivRank <= parseFloat(maxIvRank) &&
        option.returnOnMargin >= parseFloat(minReturn) &&
        option.returnOnMargin <= parseFloat(maxReturn) &&
        option.daysToExpiry >= parseInt(minDaysToExpiry) &&
        option.daysToExpiry <= parseInt(maxDaysToExpiry) &&
        option.volume >= parseInt(minVolume) &&
        option.openInterest >= parseInt(minOpenInterest) &&
        (!sector || option.sector === sector) &&
        (!ticker || option.ticker === ticker.toUpperCase())
      );
    });

    // Sort the results
    filteredOptions.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    // Limit results
    filteredOptions = filteredOptions.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: filteredOptions,
      count: filteredOptions.length,
      filters: {
        minIvRank: parseFloat(minIvRank),
        maxIvRank: parseFloat(maxIvRank),
        minReturn: parseFloat(minReturn),
        maxReturn: parseFloat(maxReturn),
        minDaysToExpiry: parseInt(minDaysToExpiry),
        maxDaysToExpiry: parseInt(maxDaysToExpiry),
        minVolume: parseInt(minVolume),
        minOpenInterest: parseInt(minOpenInterest),
        sector,
        ticker,
        sortBy,
        sortOrder,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error scanning options:', error);
    res.status(500).json({ success: false, error: 'Failed to scan options' });
  }
});

// Get option chain for specific ticker
app.get('/api/options/chain/:ticker', (req, res) => {
  try {
    const { ticker } = req.params;
    const { expiry } = req.query;
    
    let optionChain = mockOptionsData.filter(option => 
      option.ticker === ticker.toUpperCase()
    );

    if (expiry) {
      optionChain = optionChain.filter(option => option.expiry === expiry);
    }

    // Group by expiry date
    const groupedByExpiry = optionChain.reduce((acc, option) => {
      if (!acc[option.expiry]) {
        acc[option.expiry] = [];
      }
      acc[option.expiry].push(option);
      return acc;
    }, {});

    res.json({
      success: true,
      ticker: ticker.toUpperCase(),
      data: groupedByExpiry,
      expiryDates: Object.keys(groupedByExpiry).sort(),
      totalOptions: optionChain.length
    });
  } catch (error) {
    console.error('Error fetching option chain:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch option chain' });
  }
});

// Get available tickers
app.get('/api/tickers', (req, res) => {
  try {
    const tickers = [...new Set(mockOptionsData.map(option => option.ticker))];
    res.json({
      success: true,
      data: tickers.map(ticker => ({
        symbol: ticker,
        name: `${ticker} Corp.`
      })),
      count: tickers.length
    });
  } catch (error) {
    console.error('Error fetching tickers:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tickers' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Option AI Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API endpoints:`);
  console.log(`   - GET /api/options/best - Best option opportunities`);
  console.log(`   - GET /api/options/scan - Scan with filters`);
  console.log(`   - GET /api/options/chain/:ticker - Option chain for ticker`);
  console.log(`   - GET /api/tickers - Available tickers`);
}); 