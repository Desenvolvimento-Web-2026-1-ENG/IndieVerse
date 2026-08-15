import { CategoriaController } from "@interfaces/controllers/CategoriaController";
import { CategoriaService } from "@services/CategoriaService";
import { CategoriaRepositoryInMemory } from "@infrastructure/database/CategoriaRepositoryInMemory";
import { TarefaRepositoryInMemory } from "@infrastructure/database/TarefaRepositoryInMemory";

export class CategoriaFactory {
  static criarController(): CategoriaController {
    const catRepo = new CategoriaRepositoryInMemory();
    const tarRepo = new TarefaRepositoryInMemory();

    const service = new CategoriaService(catRepo, tarRepo);
    return new CategoriaController(service);
  }
}
