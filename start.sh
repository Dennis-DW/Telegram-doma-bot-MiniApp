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

# Create logs directory if it doesn't exist
mkdir -p logs

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
