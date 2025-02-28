import cors from 'cors';

const corsOptions = {
  origin: ['http://localhost:3000', 'https://www.collectiveactiongroup.com/', 'https://collectiveactiongroup.com/'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

export default cors(corsOptions);
