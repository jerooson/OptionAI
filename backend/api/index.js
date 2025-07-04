const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for options
const mockOptionsData = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
  }
];

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OptionAI Backend is running on Vercel',
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
    console.error('Error in /api/options/best:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Options scanner with filtering
app.get('/api/options/scan', (req, res) => {
  try {
    const {
      minIvRank,
      maxIvRank,
      minReturn,
      maxReturn,
      minDaysToExpiry,
      maxDaysToExpiry,
      minVolume,
      sector,
      ticker,
      sortBy = 'returnOnMargin',
      sortOrder = 'desc'
    } = req.query;

    let filteredOptions = [...mockOptionsData];

    // Apply filters
    if (minIvRank) {
      filteredOptions = filteredOptions.filter(option => option.ivRank >= parseFloat(minIvRank));
    }
    if (maxIvRank) {
      filteredOptions = filteredOptions.filter(option => option.ivRank <= parseFloat(maxIvRank));
    }
    if (minReturn) {
      filteredOptions = filteredOptions.filter(option => option.returnOnMargin >= parseFloat(minReturn));
    }
    if (maxReturn) {
      filteredOptions = filteredOptions.filter(option => option.returnOnMargin <= parseFloat(maxReturn));
    }
    if (minDaysToExpiry) {
      filteredOptions = filteredOptions.filter(option => option.daysToExpiry >= parseInt(minDaysToExpiry));
    }
    if (maxDaysToExpiry) {
      filteredOptions = filteredOptions.filter(option => option.daysToExpiry <= parseInt(maxDaysToExpiry));
    }
    if (minVolume) {
      filteredOptions = filteredOptions.filter(option => option.volume >= parseInt(minVolume));
    }
    if (sector) {
      filteredOptions = filteredOptions.filter(option => 
        option.sector.toLowerCase().includes(sector.toLowerCase())
      );
    }
    if (ticker) {
      filteredOptions = filteredOptions.filter(option => 
        option.ticker.toLowerCase().includes(ticker.toLowerCase())
      );
    }

    // Sort results
    if (sortBy && filteredOptions.length > 0) {
      filteredOptions.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    res.json({
      success: true,
      data: filteredOptions,
      count: filteredOptions.length,
      filters: {
        minIvRank,
        maxIvRank,
        minReturn,
        maxReturn,
        minDaysToExpiry,
        maxDaysToExpiry,
        minVolume,
        sector,
        ticker,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error in /api/options/scan:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('OptionAI Backend is running on Vercel');
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 OptionAI Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 API endpoints:`);
    console.log(`   - GET /api/options/best - Best option opportunities`);
    console.log(`   - GET /api/options/scan - Scan with filters`);
  });
}

module.exports = app; 