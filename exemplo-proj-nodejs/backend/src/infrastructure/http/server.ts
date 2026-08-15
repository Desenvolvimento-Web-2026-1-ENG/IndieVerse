import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './infrastructure/http/docs/swagger';
import jogoRoutes from './infrastructure/http/routes/jogo.routes';
import lojaRoutes from './infrastructure/http/routes/loja.routes';

const app = express();
app.use(express.json());

// Rota do Swagger Interativo
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/api/v1', jogoRoutes);
app.use('/api/v1', lojaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n✅ Servidor Pocket Store rodando na porta ${PORT}`);
  console.log(`📄 Documentação interativa em: http://localhost:${PORT}/api-docs`);
});