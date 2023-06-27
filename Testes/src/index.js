const express = require("express")
const fs = require("fs")
const { getDatabaseInstance } = require("./database")
const { log } = require("console")

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
  //const { id } = req.query
  const db = await getDatabaseInstance()
  /*if (id) {
    const result = await db.get(`SELECT * FROM movies WHERE id=?`, id)
    res.json(result)
    return
  }*/
  const result = await db.all(`SELECT * FROM movies`)
  res.json(result)
  //res.json(id.toString()) // Converte em 'String' e imprime
  //res.json(resut) /*'.json' mostra o cabeçalho completo*/
})

app.get("/movies/:id", async (req, res) => { // Ler
  const { id } = req.query
  const db = await getDatabaseInstance()
  const result = await db.get(`SELECT * FROM movies WHERE id=?`, id)
  res.json(result)
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
app.patch("/movies", async (req, res) => { /*Atualizar somente um*/
  const { id } = req.query
  const db = await getDatabaseInstance()
  const info = Object.keys(req.body).map(key => `${key}=?` ).join(', ') /*Percorre os valores e organiza o lado esquerdo*/
  const values = [...Object.values(req.body), id] /* Copia e adiciona o array para o array raiz | Quebra e adiciona o 'id' | Em um array só com valores*/
  const atualizar = `UPDATE movies SET ${info} WHERE id=?` /*Realiza o UPDATE*/
  try {
    const resut = await db.run(atualizar, values)
    res.json(resut)
  } catch (error) {
    res.status(500).json({error: "Erro 500"})
  }
  
})
/*==========================================================*/

//Object.keys(x).map(key => `${key}=?` ).join(', ')

app.delete("/movies", async (req, res) => { // Deletar
  const { id } = req.query
  const db = await getDatabaseInstance()
  const resut = await db.run(`DELETE FROM movies WHERE id=?`, 
  [id])
  res.json(resut) /*'.json' mostra o cabeçalho completo*/
})

app.listen(3000, () => console.log("Servidor rodando!")) // node http-server.js | Para executar o servidor

//update?file=xxx&texto=xxx | Para alterar (estrutura)