import { ModelsInterface } from "./ModelsInterface";

export interface BaseModelInterface {

    // Métodos
    prototype?; // método opicional que servir para criarmos métodos de instância nos nossos Models.
    associate?(models: ModelsInterface): void   // método de classe opicional serve para associarmos um Model com outro.

    // 

}