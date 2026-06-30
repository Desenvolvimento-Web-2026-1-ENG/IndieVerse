class Agenda {
    constructor(){
        this.contatos = [];
    }

    adicionarContato(nome, telefone){
        this.contatos.push({
            nome: nome,
            telefone: telefone
        });
        console.log("Adicionado:", nome);
    }

    listarContatos(){
        if(this.contatos.length === 0){
            console.log("Nenhum contato cadastrado.");
            return;
        }
        this.contatos.forEach(contato => {
            console.log(
                `Nome: ${contato.nome} | Telefone: ${contato.telefone}`
            );

        });
    }

    buscarContato(nome){
        let contato = this.contatos.find(
            c => c.nome === nome
        );
        if(contato){
            console.log(
                "Telefone:",
                contato.telefone
            );
        }else{
            console.log("Contato não encontrado");
        }
    }
}