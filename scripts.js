const Modal = {
    abrirModal() {
        document.querySelector('.modalSobreposto').classList.add('active')
    },
    fecharModal() {
        document.querySelector('.modalSobreposto').classList.remove('active')
    },
    abrirModalSaida() {
        document.querySelector('.modalSobrepostoSaida').classList.add('active')
    }
}

const Armazenar = {
    get() {
        return JSON.parse(localStorage.getItem('person.finance: transacoes'))|| []
        
    },
    set(transacoes) {
        localStorage.setItem('person.finance: transacoes', JSON.stringify(transacoes))
    }
}


const Utils = {

    formatarData(data) {
        const separarData = data.split('-')
        return `${separarData[2]}/${separarData[1]}/${separarData[0]}`
        
        
        
    },

    formatarQuantia(value) {
        value = Number(value) * 100
        

        return value
    
    },

    formatarMoeda(value) {
        const sinal = Number(value) < 0 ? '-' : ''
        value = String(value).replace(/\D/g, "") 

        value = Number(value) / 100

        value = value.toLocaleString('pt-Br', {style: 'currency', currency: 'BRL'})

        return sinal + value


    },
    
}

const Transacao = {
    all: Armazenar.get(), 

    add(transacao) {
        Transacao.all.push(transacao)


        App.recarregar()
    },

    remover(index) {
        Transacao.all.splice(index, 1)

        App.recarregar()
    },

    entrada() {
            let entrada = 0
            Transacao.all.forEach((transacao) => {
                if (transacao.quantia > 0) {
                    entrada += transacao.quantia
                }
            })
            return entrada       

    },

    saidas() {
        
            let saida = 0
            Transacao.all.forEach((transacao) => {
                if (transacao.quantia < 0) {
                    saida += transacao.quantia
                }
            })
            return saida
            
        },

    total() {
        return Transacao.entrada() + Transacao.saidas()
    }
}       
        
const DOM = {

    conteinerDeTransacoes: document.querySelector('#tabelaDeDados tbody'),
    
    addTransacao(transacao, index) {
        
        
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransacao(transacao, index)
        tr.dataset.index = index

        DOM.conteinerDeTransacoes.appendChild(tr)


        
    },
    innerHTMLTransacao(transacao, index) {

        const classeCSS = transacao.quantia > 0 ? 'positivo' : 'negativo'

        const quantia = Utils.formatarMoeda(transacao.quantia)

        const html = `
        
            <td class='descricao'>${transacao.descricao}</td>
            <td class='${classeCSS}'>${quantia}</td>
            <td class='data'>${transacao.data}</td>
            <td>
                <img onclick='Transacao.remover(${index})'  src='./assets/minus.svg' alt='Remover transação'>
            </td>                     
        
        `
        return html
    },
    atualizarBalanço() {
        document.querySelector('#displayEntrada').innerHTML = Utils.formatarMoeda(Transacao.entrada())
        document.querySelector('#displaySaida').innerHTML = Utils.formatarMoeda(Transacao.saidas()) 
        document.querySelector('#displayTotal').innerHTML = Utils.formatarMoeda(Transacao.total())
    },
    limparTransacoes(){
        DOM.conteinerDeTransacoes.innerHTML = ''
    }
    
}

const Formulario = {
    
    descricao: document.querySelector('#descricao'),
    quantia: document.querySelector('#quantia'),
    data: document.querySelector('#data'),


    pegarValores() {
        return {
            descricao: Formulario.descricao.value,
            quantia: Formulario.quantia.value,
            data: Formulario.data.value,

        }
    },


    campoValidacao() {

        const { descricao, quantia, data} = Formulario.pegarValores()
        if (
            descricao.trim() === '' ||
            quantia.trim() === '' || 
            data.trim() === '') {
                throw new Error('Verifique os campos e preencha-os corretamente.') 
            }
        
        
        
    },

    formatarValor() {
        let { descricao, quantia, data} = Formulario.pegarValores()

        quantia = Utils.formatarQuantia(quantia)

        data = Utils.formatarData(data)

        return {
            descricao: descricao,
            quantia: quantia,
            data: data
        }
       
    },

  

    limparCampos() {
        Formulario.descricao.value = ''
        Formulario.quantia.value = ''
        Formulario.data.value = ''
    },
    
    submit(event) {

        event.preventDefault()

        try {
            Formulario.campoValidacao()

            const transacao = Formulario.formatarValor()

            Transacao.add(transacao)

            Formulario.limparCampos()

            Modal.fecharModal()

           

        }

        catch (error) {
           alert(error.message)


        }


        //
        
    }
}

const App = {
    iniciar() {
        
        Transacao.all.forEach((transacao, index) => {
            DOM.addTransacao(transacao, index)
        })
        
               
        DOM.atualizarBalanço()

        Armazenar.set(Transacao.all)
           
        
    },
    recarregar() {
        DOM.limparTransacoes()
        App.iniciar()

    }
}

App.iniciar()






