import * as Sequelize from "sequelize";
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { ModelsInterface } from "../interfaces/ModelsInterface";

// Interface que vai ter os campos das nossas tabelas do banco de dados.
export interface UserAttributes {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    photo?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Interface que será usada quando trabalharmos com uma instância de um usuário
export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {

    // Sequelize.Instance<UserAttributes> --> É usado para poder usar os métodos de instância do nosso registro
    // UserAttributes --> Acessa pela instância os atributos em si.

    // Define as assinaturas dos métodos
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
                    const salt = genSaltSync(); // gera um valor randomico que seráadicionado ao hash da senha do usuário.
                    // critografando a senha do usuário
                    user.password = hashSync(user.password, salt);
                },
                beforeUpdate: (user: UserInstance, options: Sequelize.CreateOptions): void => {
                    if (user.changed('password')) {
                        const salt = genSaltSync(); 
                        user.password = hashSync(user.password, salt);
                    }
                }
            }
        });

        // Se quisermos fazer uma assciação entre Models
        User.associate = (models: ModelsInterface): void => {
            // aqui fariamos as associações.
        };

        // Implementa os métodos
        User.prototype.isPassword = (encodePassword: string, password: string): boolean => {
            // compara a senha aberta(password) com a senha criptografada(encodePassword).
            return compareSync(password, encodePassword);
        }

    return User;    
};