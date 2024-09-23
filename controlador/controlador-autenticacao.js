const { query } = require('express')
const db = require('../db.json')
const jwt = require('jsonwebtoken')

const login = async (req, res) =>{
    try{
        const {email, senha} = req.body;
        const lista_clientes = db.clientes  

        if (!email || !senha){
            res.send({erro:'email ou senha não enviado'})
        }  

        const cliente = lista_clientes.find(
            (cliente) => cliente?.email == email
            )

        if(!cliente){
            res.status(404).send({error:'not found'})
        }

        const senhaValida = bcrypt.compareSync(senha, cliente.senha)
        
        if(!senhaValida){
            res.send({erro:'a senha é invalida'})
        }

        const token = jwt.sign(
        {
            nome: cliente.nome,
            email: cliente.email,
            _id: cliente.id
        },
        process.env.chave_criptografia,
        {expiresIn: 1000*60*60*24*365}
        )
        console.log(token)
        
        res.cookies("TokenAulaBE", token).send({massage:"Ok"})
    }catch(e){
        console.log(e)
    }
}

const logout = async(req, res) => {
    res.cookie("tokenAulaBE", "none", expiresIn=5)
    res.send({message:'o usuario fez logout'})
}

module.exports = {login, logout}