import { Pessoa } from "./pessoa";
import { Contato } from "./contato";


export class Agenda {
    private pessoas: Pessoa[];

    constructor() {
        this.pessoas = [];
    }

    adicionarPessoa(pessoa: Pessoa): void {
        this.pessoas.push(pessoa);
    }

    listarPessoas(): void {
        this.pessoas.forEach(pessoa => {
            pessoa.mostrarDados();
        });
    }
}