const connection = require('../database/connection');

module.exports = {
    async create(Request, Response){
        const {nome, descricao, valor, categoria, data} = Request.body;
        const user_id = Request.headers.authorization;
        const {caixa_id} = Request.params;
        
        await connection('movimentacao').insert({
            nome, 
            descricao, 
            valor, 
            categoria,
            data,
            user_id,
            caixa_id,
        });
        
        const result = await connection('caixa')
        .where('id', caixa_id).update({saldo: valor});
        
        if(result){
            return Response.json({valor})
        }

        return Response.status(401).json({error: 'Operação não permitida!'})
    },

    async list(Request, Response){
        const move = await connection('movimentacao').select('*');
        return Response.json(move);
    },
}