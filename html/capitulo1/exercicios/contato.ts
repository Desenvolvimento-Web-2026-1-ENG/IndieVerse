export class Contato {
    private nome: string;
    private telefone: string;
    
    constructor(nome: string, telefone: string) {
        this.nome = nome;
        this.telefone = telefone;
    }

    getNome(): string {
        return this.nome;
    }

    getTelefone(): string {
        return this.telefone;
    }
}