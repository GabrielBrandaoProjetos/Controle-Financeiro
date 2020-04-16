const connection = require('../database/connection');

module.exports = {
    async create(Request, Response){
        const {nome, descricao, valor, categoria, data} = Request.body;
        const user_id = Request.headers.authorization;
        const {caixa_id} = Request.params;

        const [caixa] = await connection('caixa').where('id', caixa_id).select('*')
        //Obs: Como definir a ideia de caixa livre
        const [caixa_livre] = await connection('caixa').where('nome', 'Livre').select('*')
        
        //Verifica se o valor passado é um número e válido
        if (typeof(valor) != 'number' ||  valor <= 0){
            return Response.status(400).json({error: 'Operação não permitida! Valor nulo ou zero'})
        }

        await connection('caixa').where('id', caixa_id).increment('saldo', valor)

        //Verifica se foi definido um teto e uma entrada limite de caixa no sistema
        if (caixa['teto'] != null && caixa['entrada_limite'] != null){
            //Verifica se o teto já foi atingido
            if(caixa['saldo'] == caixa['teto']){
                //Encaminha para o caixa livre e cria a movimentação
                await connection('caixa').where('id', caixa_livre['id']).increment('saldo', valor);
                await connection('movimentacao').insert({
                    nome: caixa['nome'], 
                    descricao: "Excedente", 
                    valor: valor_livre, 
                    categoria,
                    data,
                    user_id,
                    caixa_id: caixa_livre['id'],
                });
                return Response.status(200).json(`R$ ${valor} adicionado ao caixa livre`)
            //Verifica se o valor passado é menor que o limite de entrada
            }else if(valor <= caixa['entrada_limite']){
                //Verifica se o valor passado excede a entrada limite
                if(valor + caixa['saldo'] > caixa['teto']){
                    let valor_livre = (valor + caixa['saldo']) - caixa['teto']
                    let valor_movido = valor - valor_livre
                    //Encaminha o valor para o caixa de destino e cria a movimentação
                    await connection('caixa').where('id', caixa_id).increment('saldo', valor_movido)
                    await connection('movimentacao').insert({
                        nome, 
                        descricao, 
                        valor: valor_movido, 
                        categoria,
                        data,
                        user_id,
                        caixa_id,
                    });
                    //Encaminha o valor excedente para o caixa livre e cria a movimentação
                    await connection('caixa').where('id', caixa_livre['id']).increment('saldo', valor_livre)
                    await connection('movimentacao').insert({
                        nome: caixa['nome'], 
                        descricao: "Excedente", 
                        valor: valor_livre, 
                        categoria,
                        data,
                        user_id,
                        caixa_id: caixa_livre['id'],
                    });
                    return Response.json(`R$ ${valor_livre} adicionado ao Caixa Livre e R$ ${valor_movido} adicionado ao Caixa ${caixa['nome']}`)
                //Se valor + saldo for menor ou igual ao teto
                }else{
                    await connection('caixa').where('id', caixa_id).increment('saldo', valor)
                    await connection('movimentacao').insert({
                        nome, 
                        descricao, 
                        valor, 
                        categoria,
                        data,
                        user_id,
                        caixa_id,
                    });
                    return Response.json(`R$ ${valor} adicionado ao caixa ${caixa['nome']}`)
                }
            //Se o valor passado for maior que o limite de entrada
            }else{
                let valor_excedente = valor - caixa['entrada_limite']
                let valor = caixa['entrada_limite']
                //Verifica se o valor passado + salde excede o teto
                if(valor + caixa['saldo'] > caixa['teto']){
                    let valor_livre = ((valor + caixa['saldo']) - caixa['teto']) + valor_excedente
                    let valor_movido = valor - valor_livre
                    //Encaminha o valor para o caixa de destino e cria a movimentação
                    await connection('caixa').where('id', caixa_id).increment('saldo', valor_movido)
                    await connection('movimentacao').insert({
                        nome, 
                        descricao, 
                        valor: valor_movido, 
                        categoria,
                        data,
                        user_id,
                        caixa_id,
                    });
                    //Encaminha o valor excedente para o caixa livre e cria a movimentação
                    await connection('caixa').where('id', caixa_livre).increment('saldo', valor_livre)
                    await connection('movimentacao').insert({
                        nome: caixa['nome'], 
                        descricao: "Excedente", 
                        valor: valor_livre, 
                        categoria,
                        data,
                        user_id,
                        caixa_id: caixa_livre['id'],
                    });
                    return Response.json(`R$ ${valor_livre} adicionado ao Caixa Livre e R$ ${valor_movido} adicionado ao Caixa ${caixa['nome']}`)
                //Se valor + saldo for menor ou igual ao teto
                }else{
                    await connection('caixa').where('id', caixa_id).increment('saldo', valor)
                    await connection('movimentacao').insert({
                        nome, 
                        descricao, 
                        valor, 
                        categoria,
                        data,
                        user_id,
                        caixa_id,
                    });
                    return Response.json(`R$ ${valor} adicionado ao caixa ${caixa['nome']}`)
                }
            }
        //Verifica se foi definido um teto e não existe uma entrada limite
        }else if (caixa['teto'] != null && caixa['entrada_limite'] == null) {
            //Verifica se o teto foi atingido
            if(caixa['saldo'] == caixa['teto']){
                //Encaminha para o caixa livre e cria a movimentação
                await connection('caixa').where('id', caixa_livre['id']).increment('saldo', valor)
                await connection('movimentacao').insert({
                    nome: caixa['nome'], 
                    descricao: "Excedente", 
                    valor, 
                    categoria,
                    data,
                    user_id,
                    caixa_id: caixa_livre['id'],
                });
                return Response.json(`R$ ${valor} adicionado ao caixa livre`)
            
            }else if(valor + caixa['saldo'] > caixa['teto']){
                let valor_livre = (valor + caixa['saldo']) - caixa['teto']
                let valor_movido = valor - valor_livre
                //Encaminha o valor para o caixa de destino e cria a movimentação
                await connection('caixa').where('id', caixa_id).increment('saldo', valor_movido)
                await connection('movimentacao').insert({
                    nome, 
                    descricao, 
                    valor: valor_movido, 
                    categoria,
                    data,
                    user_id,
                    caixa_id,
                });
                //Encaminha o valor excedente para o caixa livre e cria a movimentação
                await connection('caixa').where('id', caixa_livre['id']).increment('saldo', valor_livre)
                await connection('movimentacao').insert({
                    nome: caixa['nome'], 
                    descricao: "Excedente", 
                    valor: valor_livre, 
                    categoria,
                    data,
                    user_id,
                    caixa_id: caixa_livre['id'],
                });
                return Response.json(`R$ ${valor_livre} adicionado ao Caixa Livre e R$ ${valor_movido} adicionado ao Caixa ${caixa['nome']}`)
            //Se valor + saldo for menor ou igual ao teto
            }else{
                //Encaminha o valor para o caixa de destino e cria a movimentação
                await connection('caixa').where('id', caixa_id).increment('saldo', valor)
                await connection('movimentacao').insert({
                    nome, 
                    descricao, 
                    valor, 
                    categoria,
                    data,
                    user_id,
                    caixa_id,
                });
                return Response.json(`R$ ${valor} adicionado ao caixa ${caixa['nome']}`)
            }
        //Verifica se foi definido uma entrada limite e não existe um teto
        }else if(caixa['teto'] == null && caixa['entrada_limite'] != null){
            //Verifica se o valor é menor ou igual a entrada limite
            if(valor <= caixa['entrada_limite']){
                //Encaminha o valor para o caixa de destino e cria a movimentação
                await connection('caixa').where('id', caixa_id).increment('saldo', valor)
                await connection('movimentacao').insert({
                    nome, 
                    descricao, 
                    valor: valor_movido, 
                    categoria,
                    data,
                    user_id,
                    caixa_id,
                });
            //Se o valor for maior que a entrada limite
            }else{
                let valor_livre = valor - caixa['entrada_limite']
                let valor = caixa['entrada_limite']
                //Encaminha o valor para o caixa de destino e cria a movimentação
                await connection('caixa').where('id', caixa_id).increment('saldo', valor)
                await connection('movimentacao').insert({
                    nome, 
                    descricao, 
                    valor: valor_movido, 
                    categoria,
                    data,
                    user_id,
                    caixa_id,
                });
                //Encaminha o valor excedente para o caixa livre e cria a movimentação
                await connection('caixa').where('id', caixa_livre['id']).increment('saldo', valor_livre)
                await connection('movimentacao').insert({
                    nome: caixa['nome'], 
                    descricao: "Excedente", 
                    valor: valor_excedente, 
                    categoria,
                    data,
                    user_id,
                    caixa_id: caixa_livre['id'],
                });
                return Response.json(`R$ ${valor_livre} adicionado ao Caixa Livre e R$ ${valor_movido} adicionado ao Caixa ${caixa['nome']}`)
            }
        //Se não existe teto nem entrada limite
        }else{
            //Encaminha o valor para o caixa de destino e cria a movimentação
            await connection('id', caixa_id).increment('saldo', valor);
            await connection('movimentacao').insert({
                nome, 
                descricao, 
                valor, 
                categoria,
                data,
                user_id,
                caixa_id,
            });
        }
    },

    async list(Request, Response){
        const {caixa_id} = Request.params;
        const move = await connection('movimentacao').where('caixa_id', caixa_id).select('*');
        return Response.json(move);
    },
}