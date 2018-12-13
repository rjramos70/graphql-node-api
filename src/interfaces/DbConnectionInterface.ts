import * as Sequelize from "sequelize";
import { ModelsInterface } from "./ModelsInterface";

export interface DbConnection extends ModelsInterface {

    // Atributos
    sequelize: Sequelize.Sequelize;

    // Métodos

}