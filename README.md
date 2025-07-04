# OptionAI - Professional Options Trading Platform

🚀 A comprehensive options trading platform designed for premium selling strategies with advanced analytics, AI-powered insights, and real-time market data.

## 🎯 Features

### 📊 **Dashboard & Analytics**
- Real-time options data with live pricing
- Advanced filtering and scanning capabilities
- Earnings risk analysis with color-coded warnings
- IV rank analysis for optimal entry points
- Professional dark theme optimized for trading

### 🤖 **AI Trading Assistant**
- Interactive chat interface with streaming responses
- Expert guidance on options strategies
- Risk management recommendations
- Market analysis and trade ideas
- Dynamic response speed based on content length

### 📈 **Options Scanner**
- Filter by IV rank, delta, days to expiration
- Earnings calendar integration
- Return potential calculations
- Sortable columns with advanced metrics
- Real-time data updates

### ⚠️ **Risk Management**
- Earnings risk warnings (High/Medium/Low)
- Delta risk classification
- Position sizing recommendations
- Stop-loss and profit-taking guidance

## 🛠️ Tech Stack

### Frontend
- **React 18** with Hooks
- **Ant Design** for professional UI components
- **Vite** for fast development and building
- **CSS3** with advanced animations and responsive design

### Backend
- **Node.js** with Express.js
- **RESTful API** architecture
- **Mock data** for development (ready for real data integration)
- **CORS** enabled for cross-origin requests

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jerooson/OptionAI.git
   cd OptionAI
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Backend Server**
   ```bash
   cd ../backend
   npm start
   ```
   Backend will run on `http://localhost:5000`

5. **Start the Frontend Development Server**
   ```bash
   cd ../frontend
   npm start
   ```
   Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
OptionAI/
├── backend/
│   ├── server.js              # Express server setup
│   │   ├── routes/
│   │   │   ├── dashboard.js       # Dashboard API endpoints
│   │   │   ├── scanner.js         # Options scanner endpoints
│   │   │   └── optionChain.js     # Option chain data endpoints
│   │   ├── data/
│   │   │   └── mockData.js        # Mock options data
│   │   └── package.json
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Dashboard.jsx   # Main dashboard component
│   │   │   │   ├── OptionsScanner.jsx # Options scanner
│   │   │   │   ├── OptionChain.jsx # Option chain viewer
│   │   │   │   └── Chat.jsx       # AI chat assistant
│   │   │   ├── App.js             # Main app component
│   │   │   ├── App.css            # Global styles
│   │   │   └── index.js           # React entry point
│   │   └── package.json
│   ├── .gitignore
│   └── README.md
```

## 🎨 UI Features

### 🌙 **Dark Theme**
- Professional trading platform aesthetic
- Optimized for long trading sessions
- High contrast for better readability

### 📱 **Responsive Design**
- Mobile-friendly layout
- Adaptive sidebar navigation
- Flexible table layouts

### ⚡ **Performance**
- Fast loading with Vite
- Optimized bundle sizes
- Smooth animations and transitions

## 🤖 AI Chat Features

### 💬 **Streaming Responses**
- Dynamic typing speed based on content length
- Click to complete animation instantly
- Progress indicators for long messages
- Realistic typing patterns with punctuation pauses

### 🧠 **Expert Knowledge**
- Options strategies (CSPs, covered calls, spreads)
- Risk management guidance
- IV analysis and market insights
- Earnings calendar warnings
- Position sizing recommendations

## 📊 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Portfolio statistics
- `GET /api/dashboard/positions` - Current positions

### Scanner
- `GET /api/scanner/options` - Filtered options data
- `GET /api/scanner/filters` - Available filter options

### Option Chain
- `GET /api/option-chain/:symbol` - Option chain for specific symbol

## 🔧 Configuration

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Backend Deployment
1. Build the application
2. Set environment variables
3. Start with `npm start`

### Frontend Deployment
1. Build for production: `npm run build`
2. Serve the `build` directory
3. Configure API URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for experienced options traders
- Designed with 20+ years of trading experience insights
- Optimized for premium selling strategies
- Focus on risk management and earnings avoidance

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**⚠️ Disclaimer**: This software is for educational and informational purposes only. Options trading involves substantial risk and is not suitable for all investors. Past performance does not guarantee future results. Please consult with a financial advisor before making any investment decisions. 