const conexao = require('../conexao');

const listarEmprestimos = async (req, res) => {
  try {
    const query = `
      SELECT * from emprestimos
    `;

    const { rows: emprestimos } = await conexao.query(query);

    res.status(200).json(emprestimos);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const obterEmprestimo = async (req, res) => {
  const { id } = req.params
  try {
    const query = `
      SELECT * from emprestimos WHERE id = $1
    `;

    const emprestimo = await conexao.query(query, [id]);

    if (emprestimo.rowCount === 0) {
      return res.status(404).json('Emprestimo não encontrado');
    }

    return res.status(400).json(emprestimo.rows);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarEmprestimo = async (req, res) => {
  let {
    id_usuario, id_livro, status
  } = req.body

  try {
    const query = `
      INSERT INTO emprestimos
      (id_usuario, id_livro, status)
      VALUES
      ($1, $2, $3)
    `;

    if (!id_usuario) {
      return res.status(400).json('O campo ID do Usuário é obrigatório');
    }

    if (!id_livro) {
      return res.status(400).json('O campo ID do Livro é obrigatório');
    }

    if (!status) {
      status = 'pendente'
    }

    const emprestimoCriado = await conexao.query(query, [id_usuario, id_livro, status])


    if (emprestimoCriado.rowCount === 0) {
      return res.status(404).json('Não foi possível cadastrar o seu empréstimo.');
    }
    
    return res.status(400).json('Emprestimo criado com sucesso!')
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarEmprestimo = async (req, res) => {
  const { id } = req.params;
  const {
    id_usuario, id_livro, status
  } = req.body;

  if (id_usuario && id_livro) {
    return res.status(400).json('É permitido somente a alteração do campos STATUS, tente novamente.')
  }

  try {
    const query = `
      UPDATE emprestimos SET status = $1 WHERE ID = $2
    `;

    const emprestimoAtualizado = await conexao.query(query, [status, id])

    if (emprestimoAtualizado.rowCount === 0) {
      return res.json('Não foi possivel atualizar o empréstimo.')
    }

    res.status(200).json('Emprestimo atualizado!')
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const excluirEmprestimo = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      DELETE from emprestimos WHERE id = $1
    `;

    const emprestimoExcluido = await conexao.query(query, [id]);

    if (emprestimoExcluido.rowCount === 0) {
      return res.status(400).json('Não foi possível excluir o empréstimo.');
    }

    res.status(200).json('Empréstimo excluido com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}


module.exports = {
  listarEmprestimos,
  obterEmprestimo,
  cadastrarEmprestimo,
  atualizarEmprestimo,
  excluirEmprestimo
};