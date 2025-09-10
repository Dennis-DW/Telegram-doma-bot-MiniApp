// api/middleware/cors.js
import cors from 'cors';
import { API_CONFIG } from '../config/index.js';

export const corsOptions = {
  origin: API_CONFIG.CORS_ORIGIN,
  methods: API_CONFIG.CORS_METHODS,
  allowedHeaders: API_CONFIG.CORS_HEADERS,
  credentials: true
};

export const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
