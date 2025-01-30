import app from './app';

const PORT = parseInt(process.env.PORT || '3000', 10);

const startServer = (port: number) => {
  const server = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ El puerto ${port} está ocupado. Intentando con el puerto ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(`Error al iniciar el servidor: ${err.message}`);
      process.exit(1);
    }
  });
};

startServer(PORT);
