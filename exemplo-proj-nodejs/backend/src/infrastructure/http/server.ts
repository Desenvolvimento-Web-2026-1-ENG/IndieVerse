import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger';
import jogoRoutes from './routes/jogo.routes';
import lojaRoutes from './routes/loja.routes';

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1', jogoRoutes);
app.use('/api/v1', lojaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n✅ Servidor Pocket Store rodando na porta ${PORT}`);
  console.log(`📄 Documentação interativa em: http://localhost:${PORT}/api-docs`);
});

app.get('/api-docs-json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});