const connection = require('../database/connection')

module.exports = {
    async create(Request, Response){
        const {cpf, nome, sobrenome, email, senha} = Request.body;
        const [id] = await connection('user').insert({
            cpf,
            nome,
            sobrenome,
            email,
            senha,

        })
        return Response.json({id})
    },

    async list(Request, Response){
        const users = await connection('user').select('*');
        return Response.json(users);
    },

    async listCaixas(Request, Response){
        const {user_id} = Request.params
        const caixas = await connection('user_caixa').where('user_id', user_id).select('*');
        return Response.json(caixas);
    }
}