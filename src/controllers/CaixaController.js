const connection = require('../database/connection')

module.exports = {
    async create (Request, Response){
        const {nome, entrada_limite, teto, saldo} = Request.body
        const {user_id} = Request.params
        //Obs: retornar o id do usuario
        const senha = Request.headers.authorization
        const caixa_nome = await connection('caixa').where('nome', nome).select('nome').first()
        
        if(!caixa_nome){
            const [id] = await connection('caixa').insert({
                nome, 
                entrada_limite, 
                teto, 
                saldo,
                user_id,
            })
            await connection('user_caixa').insert({user_id, caixa_id: id})
            return Response.json({id})
        }else{
            return Response.json("O caixa já existe!")
        }
    },

    async list(Request, Response){
        const caixas = await connection('caixa').select('*');
        return Response.json(caixas);
    },

    async delete (Request, Response){
        const {id} = Request.params
        const user_id = Request.headers.authorization

        const caixa = await connection('caixa')
        .where('id', id)
        .select('user_id')
        .first()

        if (caixa.user_id != user_id){
            return Response.status(401).json({error: 'Operação não permitida!'})
        }

        await connection('caixa').where('id', id).delete();
        return Response.status(204).send();
    },

    async update(Request, Response){
        const {id} = Request.params
        const {nome, entrada_limite, teto, saldo} = Request.body
        const user_id = Request.headers.authorization

        const caixa = await connection('caixa')
        .where('id', id)
        .select('user_id')
        .first()

        if (caixa.user_id != user_id){
            return Response.status(401).json({error: 'Operação não permitida!'})
        }

        await connection('caixa').where('id', id).update({
            nome: nome, 
            entrada_limite: entrada_limite, 
            teto: teto, 
            saldo: saldo,
        })
        return Response.status(204).send();
    }
}