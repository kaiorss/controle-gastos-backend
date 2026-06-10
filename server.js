const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;


// ===============================
// MIDDLEWARES
// ===============================
app.use(cors());
app.use(express.json());


// ===============================
// BANCO DE DADOS FICTÍCIO
// ===============================
let gastos = [
  {
    id: 1,
    descricao: "Mercado",
    valor: 120.00,
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


// ===============================
// ROTA PRINCIPAL
// ===============================
app.get("/", (req, res) => {

  res.json({
    status: "Backend rodando no Docker",
    versao: "1.0.2",
    cors_ativo: true
  });

});


// ===============================
// TESTE API V1
// ===============================
app.get("/v1", (req, res) => {

  const datahora = new Date().toLocaleString(
    "pt-BR",
    {
      timeZone: "America/Sao_Paulo"
    }
  );

  res.json({
    message: "API v1 respondendo no container Docker",
    chamada_em: datahora
  });

});


// ===============================
// LISTAR GASTOS
// ===============================
app.get("/gastos", (req, res) => {

  res.json({
    mensagem: "Gastos carregados com sucesso",
    total: gastos.length,
    gastos
  });

});


// ===============================
// RESUMO FINANCEIRO
// ===============================
app.get("/gastos/resumo", (req, res) => {


  const totalGasto = gastos.reduce(
    (total, gasto) => total + gasto.valor,
    0
  );


  const totalPago = gastos
    .filter(gasto => gasto.pago)
    .reduce(
      (total, gasto) => total + gasto.valor,
      0
    );


  const totalPendente =
    totalGasto - totalPago;


  res.json({

    total_gasto: totalGasto,

    total_pago: totalPago,

    total_pendente: totalPendente

  });

});


// ===============================
// BUSCAR GASTO POR ID
// ===============================
app.get("/gastos/:id", (req, res) => {


  const gasto = gastos.find(
    g => g.id == req.params.id
  );


  if (!gasto) {

    return res.status(404).json({

      erro: "Gasto não encontrado"

    });

  }


  res.json(gasto);


});


// ===============================
// CADASTRAR GASTO
// ===============================
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

    data: new Date()
      .toISOString()
      .split("T")[0]

  };


  gastos.push(novoGasto);


  res.status(201).json({

    mensagem: "Gasto cadastrado com sucesso",

    gasto: novoGasto

  });


});


// ===============================
// MARCAR COMO PAGO
// ===============================
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


// ===============================
// REMOVER GASTO
// ===============================
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


// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {

  console.log(`Servidor rodando na porta ${PORT}`);

  console.log("CORS liberado");

});