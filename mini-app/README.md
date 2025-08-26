 # 🚀 Mini App Deployment Guide

This guide explains how to deploy the Doma Manager Mini App.

## Prerequisites

- Node.js 16+ installed
- A web server or hosting service (Vercel, Netlify, etc.)
- HTTPS domain (required for Telegram Mini Apps)

## Local Development

1. **Install dependencies:**
```bash
cd mini-app
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Access the app:**
- Open `http://localhost:5173` in your browser
- For Telegram testing, use ngrok or similar tunnel service

## Building for Production

1. **Build the app:**
```bash
npm run build
```

2. **Preview the build:**
```bash
npm run preview
```

3. **The built files will be in the `dist/` directory**

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Follow the prompts and get your deployment URL**

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

### Option 3: Manual Upload

1. **Upload the `dist/` folder contents to your web server**
2. **Ensure HTTPS is enabled**
3. **Configure your domain**

## Telegram Bot Configuration

1. **Update your bot's `.env` file:**
```env
MINI_APP_URL=https://your-deployed-app-url.com
```

2. **Set the Mini App URL in BotFather:**
   - Message @BotFather
   - Use `/setmenubutton` command
   - Set the URL to your deployed Mini App

## Testing the Integration

1. **Start your bot:**
```bash
node index.js
```

2. **Test the Mini App:**
   - Send `/start` to your bot
   - Click "🚀 Open Mini App"
   - Test wallet connection
   - Test domain operations

## Environment Variables

The Mini App uses these environment variables (set in your hosting platform):

```env
VITE_DOMA_RPC_URL=wss://your_doma_rpc_url
VITE_OWNERSHIP_TOKEN_ADDRESS=0xYourContractAddress
VITE_EXPLORER_URL=https://explorer.doma.com
```

## Troubleshooting

### Common Issues

1. **Mini App not loading:**
   - Check HTTPS is enabled
   - Verify domain is accessible
   - Check browser console for errors

2. **Wallet connection fails:**
   - Ensure MetaMask or similar wallet is installed
   - Check network configuration
   - Verify contract address

3. **Bot not receiving data:**
   - Check bot is running
   - Verify Mini App URL in bot configuration
   - Check bot logs for errors

### Debug Mode

Enable debug logging in the Mini App:

```javascript
// In src/utils/telegram.js
const DEBUG = true;
```

## Security Considerations

1. **HTTPS Required**: Telegram Mini Apps require HTTPS
2. **Domain Validation**: Ensure your domain is properly configured
3. **Wallet Security**: Never store private keys in the app
4. **Input Validation**: Validate all user inputs
5. **Error Handling**: Implement proper error handling

## Performance Optimization

1. **Code Splitting**: The build includes automatic code splitting
2. **Image Optimization**: Use optimized images
3. **Caching**: Implement proper caching headers
4. **Bundle Size**: Monitor bundle size with `npm run build`

## Monitoring

1. **Error Tracking**: Implement error tracking (Sentry, etc.)
2. **Analytics**: Add usage analytics
3. **Performance**: Monitor Core Web Vitals
4. **Uptime**: Set up uptime monitoring

## Updates

To update the Mini App:

1. **Make your changes**
2. **Test locally**
3. **Build the app:**
```bash
npm run build
```
4. **Deploy the new build**
5. **Test the live version**

## Support

For issues or questions:
- Check the troubleshooting section
- Review the main README
- Check Telegram Bot API documentation
- Review the code comments 