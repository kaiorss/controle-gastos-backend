const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configurado para aceitar frontend da Vercel
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
};

app.use(cors(corsOptions));

// Banco de dados fictício
let gastos = [
  {
    id: 1,
    descricao: "Mercado",
    valor: 120.50,
    categoria: "Alimentação",
    pago: true,
    data: "2026-05-10"
  },
  {
    id: 2,
    descricao: "Internet",
    valor: 99.90,
    categoria: "Casa",
    pago: false,
    data: "2026-05-10"
  }
];

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "Backend de Notícias rodando com CI/CD",
    versao: "1.0.1",
    cors_ativo: true,
    frontend_integrado: true
  });
});

// GET: listar todos os gastos
app.get("/gastos", (req, res) => {
  res.json({
    mensagem: "Gastos carregados com sucesso",
    total: gastos.length,
    gastos
  });   
});

// GET: gasto por ID
app.get("/gastos/:id", (req, res) => {
  const gasto = gastos.find(g => g.id == req.params.id);

  if (!gasto) {
    return res.status(404).json({
      erro: "Gasto não encontrado"
    });
  }

  res.json(gasto);
});

// GET: resumo financeiro
app.get("/gastos/resumo", (req, res) => {

  const totalGasto = gastos.reduce(
    (total, gasto) => total + gasto.valor,
    0
  );

  const totalPago = gastos
    .filter(gasto => gasto.pago)
    .reduce((total, gasto) => total + gasto.valor, 0);

  const totalPendente = totalGasto - totalPago;

  res.json({
    total_gasto: totalGasto,
    total_pago: totalPago,
    total_pendente: totalPendente
  });
});

// POST: criar gasto
app.post("/gastos", (req, res) => {

  const { descricao, valor, categoria } = req.body;

  if (!descricao || !valor || !categoria) {
    return res.status(400).json({
      erro: "Descrição, valor e categoria são obrigatórios"
    });
  }

  const novoGasto = {
    id: gastos.length > 0
      ? Math.max(...gastos.map(g => g.id)) + 1
      : 1,

    descricao,
    valor: Number(valor),
    categoria,
    pago: false,
    data: new Date().toISOString().split("T")[0]
  };

  gastos.push(novoGasto);

  res.status(201).json({
    mensagem: "Gasto cadastrado com sucesso",
    gasto: novoGasto
  });
});

// PUT: marcar gasto como pago
app.put("/gastos/:id/pagar", (req, res) => {

  const gasto = gastos.find(
    g => g.id == req.params.id
  );

  if (!gasto) {
    return res.status(404).json({
      erro: "Gasto não encontrado"
    });
  }

  gasto.pago = true;

  res.json({
    mensagem: "Gasto marcado como pago",
    gasto
  });
});

// DELETE: remover gasto
app.delete("/gastos/:id", (req, res) => {

  const index = gastos.findIndex(
    g => g.id == req.params.id
  );

  if (index === -1) {
    return res.status(404).json({
      erro: "Gasto não encontrado"
    });
  }

  gastos.splice(index, 1);

  res.json({
    mensagem: "Gasto removido com sucesso"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`CORS habilitado para: ${corsOptions.origin}`);
});