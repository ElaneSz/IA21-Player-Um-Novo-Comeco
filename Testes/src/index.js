const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")

const app = express()

app.use(express.static(__dirname + '/public')) /*Caso não ache a rota | Pega o arquivo do jeito que é e envia para o cliente*/
app.use(express.json()) /*Converte o que veio, em .json*/

app.post("/movies", async (req, res) => { // Criar
  const { title, source, description, thumb } = req.body
  const db = await getDatabaseInstance() // Conexão com o BD
  const resut = await db.run(`INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`, 
  [title, source, description, thumb])
  res.json(resut) /*'.json' mostra o cabeçalho completo*/
})

app.get("/movies", async (req, res) => { // Ler
  const { id } = req.query
  const db = await getDatabaseInstance()
  const resut = await db.get(`SELECT * FROM movies WHERE id=?`, 
  [id])
  //res.json(id.toString()) // Converte em 'String' e imprime
  res.json(resut) /*'.json' mostra o cabeçalho completo*/
})

app.put("/movies", async (req, res) => { // Atualizar
  const { id } = req.query
  const { title, source, description, thumb } = req.body
  const db = await getDatabaseInstance()
  const resut = await db.run(`UPDATE movies SET title=?, source=?, description=?, thumb=? WHERE id=?`, 
  [title, source, description, thumb, id])
  res.json(resut) /*'.json' mostra o cabeçalho completo*/
})

/*==========================================================*/
app.patch("/movies", async (req, res) => {
  const { id } = req.query
  const { title, source, description, thumb } = req.body
  const db = await getDatabaseInstance()
  const resut = await db.run(`UPDATE movies SET (title=? OR source=? OR description=? OR thumb=?) WHERE id=?`,
  [title, source, description, thumb, id])
  res.json(resut)
})

app.delete("/movies", async (req, res) => { // Deletar
  const { id } = req.query
  const db = await getDatabaseInstance()
  const resut = await db.run(`DELETE FROM movies WHERE id=?`, 
  [id])
  res.json(resut) /*'.json' mostra o cabeçalho completo*/
})

app.listen(3000, () => console.log("Servidor rodando!")) // node http-server.js | Para executar o servidor

//update?file=xxx&texto=xxx | Para alterar (estrutura)