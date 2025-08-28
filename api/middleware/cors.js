// api/middleware/cors.js
import cors from 'cors';
import { API_CONFIG } from '../config/index.js';

export const corsMiddleware = cors({
  origin: API_CONFIG.CORS_ORIGIN,
  methods: API_CONFIG.CORS_METHODS,
  allowedHeaders: API_CONFIG.CORS_HEADERS,
  credentials: true
});

export default corsMiddleware; 