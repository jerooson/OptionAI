import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Avatar, Typography, Space, Tag, Spin } from 'antd';
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined,
  MessageOutlined,
  BulbOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

// Helper function for dynamic typing delays based on content length
const getTypingDelay = (char, contentLength, currentIndex) => {
  if (!char) return 20;
  
  // Calculate speed multiplier based on content length
  // Short messages (< 100 chars): Normal speed
  // Medium messages (100-500 chars): 2x faster
  // Long messages (500+ chars): 3-4x faster
  let speedMultiplier = 1;
  if (contentLength > 500) {
    speedMultiplier = 0.25; // 4x faster
  } else if (contentLength > 200) {
    speedMultiplier = 0.4; // 2.5x faster
  } else if (contentLength > 100) {
    speedMultiplier = 0.6; // 1.7x faster
  }
  
  // Progressive speed increase - get faster as we type more
  const progressMultiplier = Math.max(0.3, 1 - (currentIndex / contentLength) * 0.5);
  speedMultiplier *= progressMultiplier;
  
  // Shorter pauses for long content
  if (['.', '!', '?'].includes(char)) {
    return (50 + Math.random() * 30) * speedMultiplier;
  }
  if ([',', ';', ':'].includes(char)) {
    return (30 + Math.random() * 20) * speedMultiplier;
  }
  if (char === '\n') {
    return (40 + Math.random() * 20) * speedMultiplier;
  }
  if (char === ' ') {
    return (10 + Math.random() * 10) * speedMultiplier;
  }
  
  // Normal character typing speed
  return (8 + Math.random() * 12) * speedMultiplier;
};

// Typewriter effect component for streaming messages
const TypewriterMessage = ({ content, onComplete, isVisible = true }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isVisible || currentIndex >= content.length || isCompleted) {
      if ((currentIndex >= content.length || isCompleted) && onComplete && !isCompleted) {
        setIsCompleted(true);
        onComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedContent(prev => prev + content[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, getTypingDelay(content[currentIndex], content.length, currentIndex)); // Dynamic speed based on content length

    return () => clearTimeout(timer);
  }, [currentIndex, content, isVisible, onComplete, isCompleted]);

  // Reset when content changes
  useEffect(() => {
    setDisplayedContent('');
    setCurrentIndex(0);
    setIsCompleted(false);
  }, [content]);

  // Function to instantly complete the message
  const completeInstantly = () => {
    if (!isCompleted) {
      setDisplayedContent(content);
      setCurrentIndex(content.length);
      setIsCompleted(true);
      if (onComplete) {
        onComplete();
      }
    }
  };

  return (
    <div 
      onClick={completeInstantly}
      style={{ cursor: currentIndex < content.length ? 'pointer' : 'default' }}
      title={currentIndex < content.length ? 'Click to complete message instantly' : ''}
    >
      <Paragraph 
        style={{ 
          color: '#ffffff', 
          margin: 0,
          whiteSpace: 'pre-line',
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      >
        {displayedContent}
        {currentIndex < content.length && !isCompleted && (
          <>
            <span style={{ 
              animation: 'blink 1s infinite',
              color: '#1890ff',
              fontWeight: 'bold'
            }}>|</span>
            {content.length > 300 && (
              <div style={{ 
                fontSize: '10px', 
                color: '#666', 
                marginTop: '4px',
                fontStyle: 'italic'
              }}>
                💡 Click to skip animation • {Math.round((currentIndex / content.length) * 100)}% complete
              </div>
            )}
          </>
        )}
      </Paragraph>
    </div>
  );
};

    const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "👋 Hello! I'm your AI Options Trading Assistant. I can help you with:\n\n• **Option Strategy Analysis** - Analyze risk/reward for different strategies\n• **Market Insights** - Get insights on IV, earnings, and market conditions\n• **Trade Ideas** - Find premium selling opportunities\n• **Risk Management** - Understand position sizing and risk\n\nWhat would you like to know about options trading?",
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: false,
      isComplete: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessageId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: false,
      isComplete: true
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue);
      const aiMessageId = Date.now() + 1;
      
      const aiMessage = {
        id: aiMessageId,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString(),
        isStreaming: true,
        isComplete: false
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessageId(aiMessageId);
      setIsLoading(false);
    }, 800); // Reduced delay for better UX
  };

  const handleStreamComplete = (messageId) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isStreaming: false, isComplete: true }
          : msg
      )
    );
    setStreamingMessageId(null);
  };

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('iv') || input.includes('implied volatility')) {
      return "📊 **Implied Volatility (IV) Analysis:**\n\nIV represents the market's expectation of future volatility. For option sellers:\n\n• **High IV (>70% rank)** = Premium selling opportunities\n• **Low IV (<30% rank)** = Avoid selling, consider buying\n• **IV Crush** = Post-earnings volatility drop\n\n💡 **Current high IV tickers:** TSLA (85.1%), AAPL (72.3%), NVDA (68.9%)\n\nWould you like me to analyze a specific ticker's IV?";
    }
    
    if (input.includes('earnings') || input.includes('earning')) {
      return "⚠️ **Earnings Trading Strategy:**\n\n**For Option Sellers:**\n• **Avoid selling** options expiring through earnings\n• **High risk** = Assignment + volatility crush\n• **Best practice** = Close positions 1-2 days before\n\n**Current Earnings Alerts:**\n🔴 AMZN (2 days) - AVOID\n🔴 TSLA (4 days) - HIGH RISK\n🟠 AAPL (11 days) - MEDIUM RISK\n\n💡 Focus on tickers with earnings 15+ days away for safer premium selling.";
    }
    
    if (input.includes('strategy') || input.includes('cash secured put') || input.includes('csp')) {
      return "🎯 **Cash-Secured Put Strategy:**\n\n**Best Conditions:**\n• IV Rank > 50%\n• 15-45 days to expiration\n• Delta: -0.15 to -0.25\n• Strong underlying company\n\n**Current Opportunities:**\n• **NVDA** $450 Put - 26.8% return, 32d to earnings ✅\n• **MSFT** $320 Put - 22.7% return, 37d to earnings ✅\n\n**Risk Management:**\n• Never risk more than 2-5% per trade\n• Diversify across sectors\n• Have cash ready for assignment\n\nWant me to analyze a specific trade?";
    }
    
    if (input.includes('delta') || input.includes('greeks')) {
      return "📈 **Options Greeks for Sellers:**\n\n**Delta (-0.15 to -0.25 ideal for CSPs):**\n• Lower delta = Lower assignment probability\n• Higher delta = More premium but more risk\n\n**Theta (Time Decay - Your Friend):**\n• Accelerates in final 30 days\n• Weekends work for you\n\n**Vega (Volatility Risk):**\n• Negative vega = Profit from IV decrease\n• Risk from IV expansion\n\n**Current Delta Analysis:**\n🟢 AAPL -0.15 (Safe)\n🟠 META -0.22 (Moderate)\n🔴 GOOGL -0.25 (Higher risk)\n\nNeed help with a specific position?";
    }
    
    if (input.includes('risk') || input.includes('management')) {
      return "🛡️ **Risk Management for Option Sellers:**\n\n**Position Sizing:**\n• Max 2-5% of portfolio per trade\n• Never more than 20% in options\n\n**Profit Taking:**\n• Close at 25-50% profit\n• Don't be greedy for last pennies\n\n**Loss Management:**\n• Set stop at 2x premium received\n• Roll before expiration if needed\n\n**Diversification:**\n• Multiple sectors\n• Different expiration dates\n• Mix of strikes\n\n**Red Flags to Avoid:**\n❌ Earnings within 7 days\n❌ IV Rank < 30%\n❌ Penny stocks\n❌ Overleveraging\n\nWhat specific risk scenario would you like to discuss?";
    }
    
    return "🤖 I understand you're asking about options trading. I can help with:\n\n• **Strategy Analysis** - CSPs, covered calls, spreads\n• **Market Analysis** - IV rank, earnings calendar, sector rotation\n• **Risk Management** - Position sizing, profit taking, stop losses\n• **Trade Ideas** - Current opportunities based on our scanner\n\nCould you be more specific about what you'd like to know? For example:\n- 'Analyze AAPL for cash-secured puts'\n- 'What's the best IV rank for selling options?'\n- 'How do I manage earnings risk?'";
  };

  const quickQuestions = [
    "What's the best IV rank for selling options?",
    "How do I manage earnings risk?",
    "Analyze current high IV opportunities",
    "Explain cash-secured put strategy",
    "What are the key Greeks for sellers?"
  ];

  return (
    <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 16, flexShrink: 0 }}>
        <h1 style={{ color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageOutlined style={{ color: '#1890ff' }} />
          AI Options Trading Assistant
        </h1>
        <p style={{ color: '#8c8c8c', margin: '8px 0 0 0' }}>
          Get expert guidance on options trading strategies, risk management, and market analysis
        </p>
      </div>

      {/* Quick Questions */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BulbOutlined />
            Quick Questions
          </div>
        }
        style={{ marginBottom: 16, flexShrink: 0 }}
        className="filters-section"
      >
        <Space wrap>
          {quickQuestions.map((question, index) => (
            <Tag
              key={index}
              color="blue"
              style={{ cursor: 'pointer', padding: '4px 8px', fontSize: '12px' }}
              onClick={() => setInputValue(question)}
            >
              {question}
            </Tag>
          ))}
        </Space>
      </Card>

      {/* Chat Messages */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrophyOutlined />
            Chat with AI Expert
          </div>
        }
        style={{ 
          flex: 1,
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0,
          marginBottom: 0
        }}
        bodyStyle={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          padding: 0,
          overflow: 'hidden'
        }}
        className="filters-section"
      >
        {/* Messages Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
              }}
            >
              <Avatar
                icon={message.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                style={{
                  backgroundColor: message.type === 'ai' ? '#1890ff' : '#52c41a',
                  flexShrink: 0
                }}
              />
              <div style={{
                maxWidth: '70%',
                backgroundColor: '#262626',
                padding: '12px 16px',
                borderRadius: '12px',
                borderTopLeftRadius: message.type === 'ai' ? '4px' : '12px',
                borderTopRightRadius: message.type === 'user' ? '4px' : '12px'
              }}>
                {message.isStreaming ? (
                  <TypewriterMessage
                    content={message.content}
                    onComplete={() => handleStreamComplete(message.id)}
                  />
                ) : (
                  <Paragraph 
                    style={{ 
                      color: '#ffffff', 
                      margin: 0,
                      whiteSpace: 'pre-line',
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}
                  >
                    {message.content}
                  </Paragraph>
                )}
                <Text 
                  style={{ 
                    color: '#8c8c8c', 
                    fontSize: '11px',
                    marginTop: '8px',
                    display: 'block'
                  }}
                >
                  {message.timestamp}
                </Text>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar
                icon={<RobotOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <div style={{
                backgroundColor: '#262626',
                padding: '12px 16px',
                borderRadius: '12px',
                borderTopLeftRadius: '4px'
              }}>
                <Spin size="small" />
                <Text style={{ color: '#8c8c8c', marginLeft: '8px' }}>
                  AI is thinking...
                </Text>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #303030',
          backgroundColor: '#1f1f1f',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about options trading strategies, risk management, or market analysis..."
              autoSize={{ minRows: 1, maxRows: 3 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{
                backgroundColor: '#262626',
                border: '1px solid #404040',
                color: '#ffffff',
                borderRadius: '8px'
              }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              style={{ height: 'auto', minHeight: '32px' }}
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chat; 