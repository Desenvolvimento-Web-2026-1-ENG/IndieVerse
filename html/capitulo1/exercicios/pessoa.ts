import { Contato } from "./contato";

export class Pessoa {
    private nome: string;
    private contato: Contato;

    constructor(nome: string, contato: Contato) {
        this.nome = nome;
        this.contato = contato;
    }

    adicionarContato(contato: Contato): void {
        this.contato = contato;
    }

    mostrarDados(): void {
        console.log(`Pessoa: ${this.nome}`);
        console.log(`Contato: ${this.contato.getNome()}`);
        console.log(`Telefone: ${this.contato.getTelefone()}`);
    }
}