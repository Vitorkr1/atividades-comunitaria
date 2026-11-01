const express = require('express')
const pool = require('../db/db.js')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.static('public'))

app.get('/atividades', async (req,res) => {
  try{
    let [result] = await pool.query(`SELECT * FROM atividades`)
    res.status(200).json(result)

  }catch (error){
    console.error('Falha no MySQL:', error.code, error.message)
    res.status(500).json({message:'erro no servidor'})
  }
  

})

app.get('/atividades/:id', async (req,res) => {
  const {id} = req.params

  if(!Number.isInteger(Number(id)) || Number(id) <= 0){
    return res.status(400).json({mensage:"digite um id valido"})
  }
  try{
  let [rows] = await pool.query(`SELECT * FROM atividades WHERE id = ?`,[id])
  if(rows.length === 0){
    return res.status(404).json({message:'atividade nao encontrada'})
  }
  res.status(200).json(rows[0])
  }catch (error){
    console.error('Falha no MySQL:', error.code, error.message)
    res.status(500).json({message:'error no servidor'})
  }

})

app.post('/atividades', async (req,res) => {
  const {titulo,local,data_evento,vagas} = req.body
  if(!titulo || !local || !data_evento || !vagas && vagas <= 0){
    return res.status(400).json({message:"todos os campos precisa esta preenchido, é a vaga tem que ser!!"})
  }
  try{
    let [insert] = await pool.query(`INSERT INTO atividades (titulo,local,data_evento,vagas) VALUES (?,?,?,?)`,[titulo,local,data_evento,vagas])
    res.status(201).json({message:'dados inserido com sucesso!!'})

  }catch (error){
    console.error('Falha no MySQL:', error.code, error.message)
    res.status(500).json({message:'error no servido'})
  }
  
})

app.put('/atividades/:id', async (req,res) => {
  const {id} = req.params
  const {titulo,local,data_evento,vagas} = req.body
  if(!titulo || !local || !data_evento || !vagas || !Number.isInteger(Number(id)) || Number(id) <= 0 || vagas <= 0){
    return res.status(400).json({message:'os dados estao invalidos verifique novamente!!!'})
  }
  try{
    const [updt] = await pool.query(`UPDATE atividades SET titulo=?,local=?,data_evento=?,vagas=? WHERE id = ?`, [titulo,local,data_evento,vagas,id])
    if(updt.affectedRows === 0){
      return res.status(404).json({message:"atividade nao encontrada"})
    }
    res.status(200).json({message:"os dados foram atualizado com sucesso!!!"})
  }catch (error){
    console.error('Falha no MySQL:', error.code, error.message)
    res.status(500).json({message:"erro no servidor"})
  }
})


app.delete('/atividades/:id', async (req,res) => {
  const {id} = req.params
  if(!Number.isInteger(Number(id)) || Number(id) <= 0){
  return res.status(400).json({mensage:"digite um id valido"})
  }
  try{
    let [rows] = await pool.query(`DELETE FROM atividades WHERE id = ?`, [id])
    if(rows.affectedRows === 0){
      return res.status(404).json({message:"atividade nao encontrada"})
    }
    res.status(200).json({message:"atividade excluida!!"})
  }catch (error){
    console.error('Falha no MySQL:', error.code, error.message)
    res.status(500).json({message:"erro 500 no servidor"})
  }
})
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor iniciado na porta ${PORT}`)
})
