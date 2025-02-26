import cors from 'cors';

const corsOptions = {
  origin: 'https://api.collectiveactiongroup.com',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

export default cors(corsOptions);
