export class Pessoa {
    nome;
    contato;
    constructor(nome, contato) {
        this.nome = nome;
        this.contato = contato;
    }
    adicionarContato(contato) {
        this.contato = contato;
    }
    mostrarDados() {
        console.log(`Pessoa: ${this.nome}`);
        console.log(`Contato: ${this.contato.getNome()}`);
        console.log(`Telefone: ${this.contato.getTelefone()}`);
    }
}
