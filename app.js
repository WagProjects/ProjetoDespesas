class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){//percorre cada um dos elementos do atributo despesa
            //console.log(i, this[i])
            if(this[i] == undefined || this[i] == null || this[i] == ''){
                return false
            }
        }
        return true
    }
}

class Bd{
    constructor(){//criando a chave
        let id = localStorage.getItem('id')//recuperar um dado com chave nomeada "id", como não há criada, valor que retornará será null
        if (id === null){//se não houver nenhuma chave,
            localStorage.setItem('id', 0)//crie a primeira chave nomeda: "id" com valor 0
        }
    }

    getProximoId(){//criando uma chave dinamica
        let proximoId = localStorage.getItem('id')//proximoId receberá o valor da chave anterior
        return parseInt(proximoId) + 1//será somado +1 no valor da chave anterior
    }

    gravar(d){
        let id = this.getProximoId()//receberá o valor da chave atualizado
        localStorage.setItem('id', id)//atualizar o valor da chave id

        localStorage.setItem(id, JSON.stringify(d))//armazenar o valor da chave id, e o valor dos campos(objeto literal) em JSON(cadeia de caracteres)
        
    }
    
    recuperarTodosRegistros(){//para adicionar um historico de despesas na tela de 'Consulta'

        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')
        
        //recupera todas as despesas cadastradas em localStorage
        for (let i = 1; i <= id ; i++){
            //recupera despesa de JSON, transformando em objeto literal e inserindo na variavel despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //se algum indice for removido
            if(despesa === null){
                continue // pule para proxima interacao do laco
            }

            despesa.id = i
            despesas.push(despesa)//inseri uma despesa no array despesas
        }
        return despesas
    }

    pesquisar(despesa){//metodo de pesquisa

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != ''){
            console.log('filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => despesa.ano == d.ano)
        }

        //mes
        if(despesa.mes != ''){
            console.log('filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => despesa.mes == d.mes)
        }

        //dia
        if(despesa.dia != ''){
            console.log('filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => despesa.dia == d.dia)
        }

        //tipo
        if(despesa.tipo != ''){
            console.log('filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => despesa.tipo == d.tipo)
        }

        //descricao
        if(despesa.descricao != ''){
            console.log('filtro de descricao')
            despesasFiltradas = despesasFiltradas.filter(d => despesa.descricao == d.descricao)
        }

        //valor
        if(despesa.valor != ''){
            console.log('filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => despesa.valor == d.valor)
        }

        //console.log(despesasFiltradas)
        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()//cria um objeto bd através da instancia da class Bd


function cadastrarDespesa(){
    //recuperação dos valores dos campos
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //cria objeto poupanca atraves da class Despesa
    let poupanca = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value,
    )

    if(poupanca.validarDados()){//condicao de sucesso

        bd.gravar(poupanca)//chama o metodo gravar, passando o objeto poupanca como parametro
        
        document.getElementById('modal_titulo').className = 'modal-title fs-5 text-success'//inseri as classes do bootstrap no titulo para estiliza-lo
        document.getElementById('modal_titulo').innerHTML = 'Registrado com sucesso'//inseri o titulo
        document.getElementById('modal_mensagem').innerHTML = 'Despesas cadastradas com sucesso!'//inseri a mensagem

        document.getElementById('modal_botao').className = 'btn btn-success'//inseri as classes do bootstrap no botao para estiliza-lo
        document.getElementById('modal_botao').innerHTML = 'Confirmar'//inseri o nome do botao
        
        
        //limpar campos após insercao dos valores
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        
        $('#registraDespesa').modal('show')//mostra popup de dialogo
    }else{//condicao de erro
        
        document.getElementById('modal_titulo').className = 'modal-title fs-5 text-danger'//inseri as classes do bootstrap no titulo para estiliza-lo
        document.getElementById('modal_titulo').innerHTML = 'Erro na gravação'//inseri o titulo
        document.getElementById('modal_mensagem').innerHTML = 'Campos obrigatórios não fora preenchidos!'//inseri a mensagem

        document.getElementById('modal_botao').innerHTML = 'Corrigir'//inseri as classes do bootstrap no botao para estiliza-lo
        document.getElementById('modal_botao').className = 'btn btn-danger'//inseri o nome do botao

        
        $('#registraDespesa').modal('show')//mostra popup de dialogo
    }
    
}

function carregaListaDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }
    
    //selecionando elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    //percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function(d){
        //console.log(d)
        //criando a linha(tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas(td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` //inseri no conteudo da coluna o valor dos atributos do objeto

        //ajustar tipo
        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = `${d.tipo}`
        linha.insertCell(2).innerHTML = `${d.descricao}`
        linha.insertCell(3).innerHTML = `${d.valor}`

        //criar o botao de exclusao de despesa

        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`

        btn.onclick = function(){
            let id = this.id.replace('id_despesa_','')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })
}


function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    
    
    /*chama o metodo pesquisar do objeto bd passando como parametro ano,mes,dia,tipo,descricao,valor OU despesa.ano; despesa.mes; despesa.dia; despesa.tipo; despesa.descricao; despesa.valor
    e atribui na variavel despesas, responsável por criar e inserir as tabelas na pagina consulta*/
    let despesas = bd.pesquisar(despesa)
    //console.log(despesas)
    

    carregaListaDespesas(despesas, true)
}