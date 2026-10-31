
const API = 'http://localhost:3000/atividades'

const lista = document.getElementById('lista')

// Função auxiliar para exibir uma atividade com segurança
function mostrarAtividade(container, atividade) {
  const bloco = document.createElement('div')

  const campos = [
    ['ID', atividade.id],
    ['Título', atividade.titulo],
    ['Local', atividade.local],
    ['Data', atividade.data_evento],
    ['Vagas', atividade.vagas]
  ]

  campos.forEach(([nome, valor]) => {
    const p = document.createElement('p')
    p.textContent = `${nome}: ${valor}`
    bloco.appendChild(p)
  })

  bloco.appendChild(document.createElement('hr'))
  container.appendChild(bloco)
}

// GET: listar todas
document.getElementById('btnListar').addEventListener('click', async () => {
  try {
    const response = await fetch(API)

    if (!response.ok) {
      throw new Error('Erro ao buscar atividades')
    }

    const atividades = await response.json()
    lista.innerHTML = ''

    if (atividades.length === 0) {
      lista.textContent = 'Nenhuma atividade cadastrada.'
      return
    }

    atividades.forEach(atividade => {
      mostrarAtividade(lista, atividade)
    })

  } catch (error) {
    lista.textContent = error.message
  }
})

// POST: cadastrar
document.getElementById('formAtividades').addEventListener('submit', async (event) => {
  event.preventDefault()

  const mensagem = document.getElementById('mensagemCadastro')

  const atividade = {
    titulo: document.getElementById('titulo').value.trim(),
    local: document.getElementById('local').value.trim(),
    data_evento: document.getElementById('data').value,
    vagas: Number(document.getElementById('vagas').value)
  }

  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(atividade)
    })

    if (!response.ok) {
      throw new Error('Erro ao cadastrar atividade')
    }

    mensagem.textContent = 'Atividade cadastrada com sucesso!'
    event.target.reset()

  } catch (error) {
    mensagem.textContent = error.message
  }
})

// GET por ID: buscar uma atividade
document.getElementById('btnBuscar').addEventListener('click', async () => {
  const id = Number(document.getElementById('buscarId').value)
  const resultado = document.getElementById('resultadoBusca')

  resultado.innerHTML = ''

  if (!Number.isInteger(id) || id <= 0) {
    resultado.textContent = 'Digite um ID válido.'
    return
  }

  try {
    const response = await fetch(`${API}/${id}`)

    if (response.status === 404) {
      resultado.textContent = 'Atividade não encontrada.'
      return
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar atividade')
    }

    const atividade = await response.json()

    mostrarAtividade(resultado, atividade)

  } catch (error) {
    resultado.textContent = error.message
  }
})

// PUT: atualizar atividade
document.getElementById('formAtualizar').addEventListener('submit', async (event) => {
  event.preventDefault()

  const id = Number(document.getElementById('atualizarId').value)
  const mensagem = document.getElementById('mensagemAtualizar')

  const atividade = {
    titulo: document.getElementById('atualizarTitulo').value.trim(),
    local: document.getElementById('atualizarLocal').value.trim(),
    data_evento: document.getElementById('atualizarData').value,
    vagas: Number(document.getElementById('atualizarVagas').value)
  }

  if (!Number.isInteger(id) || id <= 0) {
    mensagem.textContent = 'Digite um ID válido.'
    return
  }

  if (!atividade.titulo || !atividade.local ||
      !atividade.data_evento ||
      !Number.isInteger(atividade.vagas) ||
      atividade.vagas <= 0) {
    mensagem.textContent = 'Preencha os dados corretamente.'
    return
  }

  try {
    const response = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(atividade)
    })

    if (response.status === 404) {
      mensagem.textContent = 'Atividade não encontrada.'
      return
    }

    if (!response.ok) {
      throw new Error('Erro ao atualizar atividade')
    }

    mensagem.textContent = 'Atividade atualizada com sucesso!'
    event.target.reset()

  } catch (error) {
    mensagem.textContent = error.message
  }
})

// DELETE: excluir atividade
document.getElementById('btnExcluir').addEventListener('click', async () => {
  const id = Number(document.getElementById('excluirId').value)
  const mensagem = document.getElementById('mensagemExcluir')

  if (!Number.isInteger(id) || id <= 0) {
    mensagem.textContent = 'Digite um ID válido.'
    return
  }

  const confirmar = confirm(`Deseja realmente excluir a atividade ${id}?`)

  if (!confirmar) {
    return
  }

  try {
    const response = await fetch(`${API}/${id}`, {
      method: 'DELETE'
    })

    if (response.status === 404) {
      mensagem.textContent = 'Atividade não encontrada.'
      return
    }

    if (!response.ok) {
      throw new Error('Erro ao excluir atividade')
    }

    mensagem.textContent = 'Atividade excluída com sucesso!'
    document.getElementById('excluirId').value = ''

  } catch (error) {
    mensagem.textContent = error.message
  }
})
