export class Contato {
    nome;
    telefone;
    constructor(nome, telefone) {
        this.nome = nome;
        this.telefone = telefone;
    }
    getNome() {
        return this.nome;
    }
    getTelefone() {
        return this.telefone;
    }
}
