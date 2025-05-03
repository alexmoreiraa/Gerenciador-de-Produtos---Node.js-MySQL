# 🛒 Gerenciador de Produtos - Node.js + MySQL

Este é um projeto simples de gerenciamento de produtos, desenvolvido com **Node.js**, 
**Express**, **MySQL**, **Express-Handlebars** e **Bootstrap**. O sistema permite **cadastrar, 
listar, editar e remover produtos**, incluindo o upload de imagens.

## 📸 Preview
<img width=400 src="imagens/Captura de tela 2025-05-02 215937.png" >

## 📌 Funcionalidades

- Cadastro de produtos com imagem e preço
- Listagem dinâmica dos produtos cadastrados
- Edição de dados e substituição de imagem
- Remoção de produtos e exclusão de imagens no servidor
- Feedback de sucesso ou falha nas operações

## 🚀 Tecnologias Utilizadas

- Node.js
- Express
- MySQL
- Express-Handlebars
- Express-FileUpload
- Bootstrap 5


## ⚙️ Configuração e Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

## 2. Instale as dependências
npm install

3. Configure o banco de dados MySQL
Crie um banco com o nome projeto e a seguinte tabela:
CREATE DATABASE projeto;

USE projeto;

CREATE TABLE produtos (
  codigo INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100),
  valor FLOAT,
  imagem VARCHAR(100)
);

Certifique-se de que o usuário, senha e nome do banco no app.js estejam corretos:
const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "projeto"
});

4. Inicie o projeto
nodemon app.js
O app estará disponível em: http://localhost:8080

📝 Observações
As imagens são armazenadas na pasta /imagens, e são removidas quando o produto é excluído.

A pasta node_modules está ignorada no .gitignore.







