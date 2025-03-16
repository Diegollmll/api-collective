import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://collectiveactiongroup.com',
    'https://www.collectiveactiongroup.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

export default cors(corsOptions);
