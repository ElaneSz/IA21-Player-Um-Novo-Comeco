const express = require("express")
const fs = require("fs")
const app = express()

app.use(express.static(__dirname + '/public'))

app.use("/qhrssao", (req, res) => {
  const { file, texto } = req.query
  fs.writeFileSync(file, texto)
  res.send(new Date())
})

app.listen(8080, () => console.log("Servidor rodando!"))