const jwt = require('jsonwebtoken');

function validadorDeCookie(req, res, next) {
    const token = req.cookies.TokenAulaBE;
    if (!token) {
        return res.status(401).send({ mensagem: 'nao autorizado' });
    }
    try {
        const decodificado = jwt.verify(token, process.env.chave_criptografia);
        next();
    } catch {
        return res.status(401).send({ mensagem: 'nao autorizado' });
    }
}

module.exports = validadorDeCookie; 
