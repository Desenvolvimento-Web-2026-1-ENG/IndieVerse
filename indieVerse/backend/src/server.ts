import express, { Request, Response } from "express";
import cors from 'cors';

import categoriaRoutes from './infrastructure/http/routes/categoria.routes';
import desenvolvedorRoutes from './infrastructure/http/routes/desenvolvedor.routes';
import jogadorRoutes from './infrastructure/http/routes/jogador.routes';
import jogoRoutes from './infrastructure/http/routes/jogo.routes';
import lojaRoutes from './infrastructure/http/routes/loja.routes';

const app = express();
const PORTA = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use('/api/v1', categoriaRoutes);
app.use('/api/v1', desenvolvedorRoutes);
app.use('/api/v1', jogadorRoutes);
app.use('/api/v1', jogoRoutes);
app.use('/api/v1', lojaRoutes);

app.get('/api/status', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Online' });
});

app.listen(PORTA, () => {
  console.log(`Backend rodando com sucesso em http://localhost:${PORTA}`);
});