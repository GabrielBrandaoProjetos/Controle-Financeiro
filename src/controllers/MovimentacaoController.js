const connection = require('../database/connection');

module.exports = {
    async create(Request, Response){
        const {nome, descricao, valor, categoria, data} = Request.body;
        const user_id = Request.headers.authorization;
        const {caixa_id} = Request.params;
        console.log({caixa_id})
        await connection('movimentacao').insert({
            nome, 
            descricao, 
            valor, 
            categoria,
            data,
            user_id,
            caixa_id,
        });

        const [saldo] = await connection('caixa')
        .where('caixa_id', id).update({saldo: valor});


        return Response.json({saldo})
    }
}