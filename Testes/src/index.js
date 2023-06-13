const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")

const app = express()

app.use(express.static(__dirname + '/public'))

app.use("/create", async (req, res) => { // Criar
  const { title, source, description, thumb } = req.query
  const db = await getDatabaseInstance() // Conexão com o BD
  const resut = await db.run(`INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`, [title, source, description, thumb])
  res.send(resut)
})

app.use("/read", async (req, res) => { // Ler
  const { id } = req.query
  const db = await getDatabaseInstance()
  const resut = await db.get(`SELECT * FROM movies WHERE id=?`, [id])
  //res.send(id.toString()) // Converte em 'String' e imprime
  res.send(resut)
})

app.use("/update", async (req, res) => { // Atualizar
  const { id, title, source, description, thumb } = req.query
  const db = await getDatabaseInstance()
  const resut = await db.run(`UPDATE movies SET title=?, source=?, description=?, thumb=? WHERE id=?`, [title, source, description, thumb, id])
  res.send(resut)
})

app.use("/delete", async (req, res) => { // Deletar
  const { id } = req.query
  const db = await getDatabaseInstance()
  const resut = await db.run(`DELETE FROM movies WHERE id=?`, [id])
  res.send(resut)
})

app.listen(3000, () => console.log("Servidor rodando!")) // node http-server.js | Para executar o servidor

//update?file=xxx&texto=xxx | Para alterar (estrutura)