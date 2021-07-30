const conexao = require('../conexao');


const listarUsuarios = async (req, res) => {
  try {
    const query = `
    select * from usuarios
  `;
  const { rows: usuarios } = await conexao.query(query);

  for (const usuario of usuarios) {
    const { rows: emprestimos } = await conexao.query('SELECT * FROM emprestimos WHERE id_usuario = $1', [usuario.id]);
    usuario.emprestimos = emprestimos;
  }

  return res.status(200).json(usuarios);

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const obterUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      select * from usuarios where id = $1
    `;
    const usuario = await conexao.query(query, [id]);
    const { rows: emprestimos } = await conexao.query('SELECT * FROM emprestimos WHERE id_usuario = $1', [usuario.rows[0].id]);
    usuario.rows[0].emprestimo = emprestimos;  
    console.log(usuario.rows)
    

    if (usuario.rowCount === 0) {
      res.status(404).json('Usuário não encontrado.')
    }
    return res.status(200).json(usuario.rows);

  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const cadastrarUsuario = async (req, res) => {
  const {
    nome, idade, email, telefone, cpf
  } = req.body;

  try {
   const query = `
      insert into usuarios
      (nome, idade, email, telefone, cpf)
      values
      ($1, $2, $3, $4, $5)
   `;

   if(!nome) {
    return res.status(400).json("O campo nome é obrigatório.");
   }

   if(!email) {
    return res.status(400).json("O campo email é obrigatório.");
   }

   if(!cpf) {
    return res.status(400).json("O campo cpf é obrigatório.");
   }

   const usuarioCadastrado = await conexao.query(query, [nome, idade, email, telefone, cpf]);

   if (usuarioCadastrado.rowCount === 0) {
    return res.status(400).json('Não foi possível cadastrar o autor');
  }

   return res.status(200).json('Usuário cadastrado com sucesso.');

  } catch (error) {
   return res.status(400).json(error.message);
  }
};

const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const {
    nome, idade, email, telefone, cpf
  } = req.body;

  try {
    const query = `
    update usuarios set nome = $1, idade = $2, email = $3, telefone = $4, cpf = $5
    where id = $6
    `;

    if(!nome) {
      return res.status(400).json("O campo nome é obrigatório.");
     }
  
     if(!email) {
      return res.status(400).json("O campo email é obrigatório.");
     }
  
     if(!cpf) {
      return res.status(400).json("O campo cpf é obrigatório.");
     }

    const usuarioAtualizado = await conexao.query(query, [nome, idade, email, telefone, cpf, id])

    if (usuarioAtualizado.rowCount === 0) {
      return res.status(400).json('Não foi possível atualizar o autor');
    }

    return res.status(200).json('Usuário atualizado com sucesso')

    
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const excluirUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const emprestimoAtivo = await conexao.query('SELECT * FROM emprestimos WHERE id_usuario = $1', [id]);

    if (emprestimoAtivo.rowCount === 1) {
      return res.json('Não foi possível exclui o usuário, pois há livros emprestados, devolva os livros para cancelar o cadastro.');
    }
    
    const query = `
      delete from usuarios where id = $1
    `;


    const usuarioExcluido = await conexao.query(query, [id]);

    if (usuarioExcluido.rowCount === 0) {
      return res.status(404).json('Não foi possível excluir o usuário');
    }
    res.status(200).json('usuário excluido com sucesso')
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  listarUsuarios,
  obterUsuario,
  cadastrarUsuario,
  atualizarUsuario,
  excluirUsuario
}