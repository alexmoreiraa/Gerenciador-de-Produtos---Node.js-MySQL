// IMPORTANDO MODULO EXPRESS
const express = require("express");

// IMPORTANDO MODULO UPLOAD
const fileupload = require("express-fileupload");

// IMPORTAR MODULO EXPRESS-HANDLEBARS
const { engine } = require("express-handlebars");

// IMPORTAR MODULO MYSQL
const mysql = require("mysql2");

// IMPORTAR FILE SYSTEMS

const fs = require("fs");
const { log } = require("console");

// APP
const app = express();

// HABILITANDO O UPLOAD DE ARQUIVOS
app.use(fileupload());

//ADCIONAR BOOTSTRAP
app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));

//ADCIONAR CSS
app.use("/css", express.static("./css"));

//ADCIONAR / REFERENCIAR A PASTA IMAGENS
app.use("/imagens", express.static("./imagens"));

// CONFIGURAÇÃO DO EXPRESS-HANDLEBARS
app.engine('handlebars', engine({
    helpers: {
      // Função auxiliar para verificar igualdade
      condicionalIgualdade: function (parametro1, parametro2, options) {
        return parametro1 === parametro2 ? options.fn(this) : options.inverse(this);
      }
    }
  }));
app.set('view engine', 'handlebars');
app.set('views', './views');

// MANIPULAÇÃO DE DADOS VIA ROTAS
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// CONFIGURAÇÃO DE CONEXÃO
const conexao = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"projeto"
});

//TESTE DE CONEXÃO 
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log("Conexão efetuada com sucesso!!");
    
})

// ROTA PRINCIPAL
app.get("/", function (req, res){
    //COMANDO SQL
    let sql = "SELECT * FROM produtos";

    //EXECUTAR COMANDO SQL
    conexao.query(sql , function(erro, retorno){
        res.render("formulario", {produtos:retorno});
    });
});

// ROTA PRINCIPAL CONTENDO A SITUAÇÃO
app.get("/:situacao", function (req, res){
    //COMANDO SQL
    let sql = "SELECT * FROM produtos";

    //EXECUTAR COMANDO SQL
    conexao.query(sql , function(erro, retorno){
        res.render("formulario", {produtos:retorno, situacao:req.params.situacao});
    });
});


// ROTA DE CADASTRO
app.post("/cadastrar", function(req, res){
    try{
        //OBTER OS DADOS QUE SERÃO UTILIZADOS PARA O CADASTRO
    let nome = req.body.nome;
    let valor = req.body.valor;
    let imagem = req.files.imagem.name;

    // VALIDAR O NOME DO PRODUTO E O VALOR
    if(nome == "" || valor == "" || isNaN(valor)){
        res.redirect("/falhaCadastro");
    }else {
        //COMANDO SQL
    let sql = `INSERT INTO  produtos (nome, valor, imagem) VALUES ("${nome}", ${valor}, "${imagem}")`;

    //EXECUTAR COMANDO SQL
    conexao.query(sql, function(erro, retorno){
        //CASO OCORRA ALGUM ERRO
        if (erro) throw erro;

        //CASO OCORRA O CADASTRO
        req.files.imagem.mv(__dirname+"/imagens/"+req.files.imagem.name);
    
    });

    //RETORNAR PARA A ROTA PRINCIPAL
    res.redirect("/okCadastro")
    }

    
    }catch(erro){
        res.redirect("/falhaCadastro")
    }
});

// ROTA PARA REMOVER PRODUTOS
app.get("/remover/:codigo&:imagem", function(req, res){
    //TRATATIVA DE EXCEÇÃO
    try{
        //COMANDO SQL
    let sql =`DELETE FROM produtos WHERE codigo = ${req.params.codigo}`;

    // EXECUTAR O COMANDO SQL
    conexao.query(sql, function(erro, retorno){
        //CASO FALHE O COMANDO SQL
        if (erro) throw erro;

        // CASO O COMANDO SQL FUNCIONE
        fs.unlink(__dirname+"/imagens/"+req.params.imagem, (erro_imagem)=>{
            console.log("imagem removida")
        });
    });

    // REDRECIONANDO

    res.redirect("/okRemover");
    }catch(erro){
        res.redirect("/falhaRemover");
    }
});
    
// ROTA PARA REDIRECIONAR PARA O FORMULARIO DE ALTERAÇÃO/EDIÇÃO
app.get("/formularioEditar/:codigo", function(req, res){
    //COMANDO SQL
    let sql = `SELECT * FROM produtos WHERE codigo = ${req.params.codigo}`;

    // EXECUTAR O COMANDO SQL
    conexao.query(sql, function(erro, retorno){
        // CASO HAJA ERRO NO COMANDO SQL
        if (erro) throw erro;

        // CASO CONSIGA EXECUTAR O COMANDO SQL
        res.render("formularioEditar", {produto:retorno[0]});
    });
    
});

// ROTA PARA EDITAR PRODUTOS
app.post("/editar", function(req, res){


// OBTER OS DADOS DO FORMULARIO
let nome = req.body.nome;
let valor = req.body.valor;
let codigo = req.body.codigo;
let nomeImagem = req.body.nomeImagem;

// VALIDAR NOME DO PRODUTO E VALOR
if (nome == "" || valor == "" || isNaN(valor)){
    res.redirect("/falhaEdicao");
}else {
    // DEFINIR O TIPO DA EDIÇÃO
try {
    // OBJETO DE IMAGEM
    let imagem = req.files.imagem;

    // COMANDO SQL
    let sql = `UPDATE produtos SET nome="${nome}", valor=${valor}, imagem="${imagem.name}"
    WHERE codigo=${codigo}`;

    // EXECUTAR COMANDO SQL
    conexao.query(sql, function(erro, retorno){
        // CASO FALHE O COMANDO SQL
        if(erro) throw erro;

        // REMOVER A IMAGEM ANTIGA
        fs.unlink(__dirname+"/imagens/"+nomeImagem, (erro_imagem)=>{
            console.log("Falha ao remover a imagem");
            
        });

        //CADASTRAR NOVA IMAGEM
        imagem.mv(__dirname+"/imagens/"+imagem.name);

    });

}catch (erro) {
    // COMANDO SQL
    let sql = `UPDATE produtos SET nome="${nome}", valor=${valor}
    WHERE codigo=${codigo}`;

    // EXECUTAR COMANDO SQL
    conexao.query(sql, function(erro, retorno){
        // CASO FALHE O COMANDO SQL
        if (erro) throw erro;
    });
};

    // REDIRECIONAMENTO
    res.redirect("/okEdicao");
}


});

// SERVIDOR
app.listen(8080);