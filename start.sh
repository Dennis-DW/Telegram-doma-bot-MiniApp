#!/bin/bash

# Doma Bot Startup Script with PM2
echo "🚀 Starting Doma Bot with PM2 Process Manager..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing..."
    npm install -g pm2
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️ .env file not found. Please create one based on .env.example"
    exit 1
fi

# Load environment variables using dotenv
echo "🔧 Loading environment variables..."
if command -v node &> /dev/null; then
    # Use Node.js to load and validate environment variables
    node -e "
    require('dotenv').config();
    const required = ['TELEGRAM_BOT_TOKEN', 'MONGODB_URI', 'DOMA_RPC_URL', 'OWNERSHIP_TOKEN_ADDRESS'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        console.error('Please check your .env file');
        process.exit(1);
    }
    
    console.log('✅ Environment variables loaded successfully');
    console.log('📋 Configuration:');
    console.log('   • Telegram Bot: ' + (process.env.TELEGRAM_BOT_TOKEN ? '✅ Configured' : '❌ Missing'));
    console.log('   • MongoDB: ' + (process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing'));
    console.log('   • Doma RPC: ' + (process.env.DOMA_RPC_URL ? '✅ Configured' : '❌ Missing'));
    console.log('   • Contract: ' + (process.env.OWNERSHIP_TOKEN_ADDRESS ? '✅ Configured' : '❌ Missing'));
    console.log('   • Node Environment: ' + (process.env.NODE_ENV || 'development'));
    "
    
    if [ $? -ne 0 ]; then
        echo "❌ Environment validation failed"
        exit 1
    fi
else
    echo "⚠️ Node.js not found, skipping environment validation"
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Set environment variables for PM2
export NODE_ENV=${NODE_ENV:-production}

# Start the bot with PM2
echo "🔄 Starting bot processes..."
pm2 start ecosystem.config.cjs

# Show status
echo "📊 Bot Status:"
pm2 status

# Show logs
echo "📝 Recent logs:"
pm2 logs --lines 20

echo "✅ Bot started successfully!"
echo "📋 Useful commands:"
echo "   pm2 status          - Check bot status"
echo "   pm2 logs            - View logs"
echo "   pm2 monit           - Monitor processes"
echo "   pm2 restart all     - Restart all processes"
echo "   pm2 stop all        - Stop all processes"
echo "   pm2 delete all      - Delete all processes"
echo ""
echo "🔧 Environment loaded from .env file"
