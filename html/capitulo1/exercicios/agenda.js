export class Agenda {
    pessoas;
    constructor() {
        this.pessoas = [];
    }
    adicionarPessoa(pessoa) {
        this.pessoas.push(pessoa);
    }
    listarPessoas() {
        this.pessoas.forEach(pessoa => {
            pessoa.mostrarDados();
        });
    }
}
