const conexao = require('../conexao');

const listarLivros = async (req, res) => {
  try {
    const query = `
      SELECT livros.id, autores.nome as nome_autor, livros.nome, livros.genero, livros.editora, livros.data_publicacao FROM livros
      LEFT JOIN autores ON livros.autor_id = autores.id
    `
    const { rows: livros } = await conexao.query(query);
    
    return res.status(200).json(livros);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterLivro = async (req, res) => {
  const { id } = req.params;

  try {
    const livro = await conexao.query('select * from livros where id = $1', [id]);

    if(livro.rowCount === 0) {
      return res.status(404).json('Livro não encontrado')
    }

    return res.status(200).json(livro.rows);

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarLivro = async (req, res) => {
  const { 
    autor_id, nome, editora, genero, data_publicacao
  } = req.body;

  // verificação campo autor_id e genero
  if (!genero) {
    return res.status(400).json("O campo genero é obrigatório");
  }

  if (!autor_id) {
    return res.status(400).json("O campo ID do Autor é obrigatório");
  }

  try {
    const livroCadastrado = await conexao.query('insert into livros (autor_id, nome, editora, genero, data_publicacao) values ($1, $2, $3, $4, $5)', [autor_id, nome, editora, genero, data_publicacao]);

    if (livroCadastrado.rowCount === 0) {
      return res.status(400).json('Não foi possível cadastrar o livro');
    } 

    return res.status(200).json('Livro cadastrado com sucesso.');

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const atualizarLivro = async (req, res) => {
  const { id } = req.params;
  const {
     autor_id, nome, editora, genero, data_publicacao
   } = req.body;

  try {
    if (!nome) {
      return res.status(400).json("O campo nome é obrigatório.")
    }

    if (!autor_id) {
      return res.status(400).json("O campo id do autor é obrigatório.")
    }

    const livroAtualizado = await conexao.query('update livros set autor_id = $1, nome = $2, editora = $3, genero = $4, data_publicacao = $5 where id = $6', [autor_id, nome, editora, genero, data_publicacao, id]);

    if (livroAtualizado.rowCount === 0) {
      return res.status(404).json('Não foi possível atualizar o livro')
    }

    return res.status(200).json('Livro atualizado com sucesso.');
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const excluirLivro = async (req, res) => {
  const { id } = req.params;

  try {
    const livroExcluido = await conexao.query('delete from livros where id = $1', [id]);

    if (livroExcluido.rowCount === 0) {
      return res.status(404).json('Livro não encontrado.');
    }

    return res.status(200).json('Livro excluido com sucesso.');
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarLivros,
  obterLivro,
  cadastrarLivro,
  atualizarLivro,
  excluirLivro
}