const express = require("express")
const fs = require("fs")
const app = express()

app.use(express.static(__dirname + '/public'))

app.use("/create", (req, res) => { //Criar
  const { file, texto } = req.query
  fs.writeFileSync(file, texto)
  res.send(`<div>Criado</div>`)
})

app.use("/read", (req, res) => { //Ler
  const { file } = req.query
  const texto = fs.readFileSync(file)
  res.send(texto.toString()) //Converte em 'String' e imprime
})

app.use("/update", (req, res) => { //Atualizar
  const { file, texto } = req.query
  fs.appendFileSync(file, texto)
  res.send()
})

app.use("/delete", (req, res) => { //Deletar
  const { file } = req.query
  fs.rmSync(file)
  res.send("Deletado")
})

app.listen(8080, () => console.log("Servidor rodando!"))

//update?file=Alegria&texto=nnnnnnn | Para alterar