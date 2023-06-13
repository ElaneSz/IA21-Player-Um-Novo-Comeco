const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")

const app = express()

app.use(express.static(__dirname + '/public'))

app.use("/create", async (req, res) => { // Criar
  const { title, source, description, thumb } = req.query
  const db = await getDatabaseInstance() // Conexão com o BD
  const resut = await bd.run(`
    INSERT INTO movies(title, source, description, thumb) VALUES(?, ?, ?, ?)`,
    [title, source, description, thumb]
  )
  res.send(resut)
})

app.use("/read", (req, res) => { // Ler
  const { file } = req.query
  const texto = fs.readFileSync(file)
  res.send(texto.toString()) // Converte em 'String' e imprime
})

app.use("/update", (req, res) => { // Atualizar
  const { file, texto } = req.query
  fs.appendFileSync(file, texto)
  res.send("Atualizado!!")
})

app.use("/delete", (req, res) => { // Deletar
  const { file } = req.query
  fs.rmSync(file)
  res.send("Deletado!!")
})

app.listen(3000, () => console.log("Servidor rodando!")) // node http-server.js | Para executar o servidor

//update?file=xxx&texto=xxx | Para alterar (estrutura)