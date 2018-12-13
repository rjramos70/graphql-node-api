import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";

// Interface que vai ter os campos das nossas tabelas do banco de dados.
export interface UserAttributes {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    photo?: string;
}

// Interface que será usada quando trabalharmos com uma instância de um usuário
export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {

    // Sequelize.Instance<UserAttributes> --> É usado para poder usar os métodos de instância do nosso registro
    // UserAttributes --> Acessa pela instância os atributos em si.

    // Métodos
    isPassword(encodePassword: string, password: string): boolean;

}

// Interface que vai servir para trabalharmos como os métodos do Model em si.
export interface UserModel extends BaseModelInterface, Sequelize.Model<UserInstance, UserAttributes> {}

// Exporta uma instância definida que contem as interfaces acima implementadas
export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): UserModel => {
    const User: UserModel = 
        sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(128),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(128),
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING(128),
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            photo: {
                type: DataTypes.BLOB({
                    length: 'long'
                }),
                allowNull: true,
                defaultValue: null
            }
        },{
            tableName: 'users',     // nome da tabela no banco
            hooks: {                // gatilho, seria como as triggers do SQL
                beforeCreate: (user: UserInstance, options: Sequelize.CreateOptions): void => {
                    // Vamos criptografar a senha antes de salvar no banco
                }
            }
        });
    return User;    
};