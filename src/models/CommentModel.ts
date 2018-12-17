import * as Sequelize from "sequelize";
import { BaseModelInterface } from '../interfaces/BaseModelInterface';
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface CommentAttributes {
    id?: number;
    comment?: string;
    post?: number;  // ID do post ao qual esse comentário pertence.
    user?: number;  // ID do user ao qual esse comentário pertence.
    createdAt?: string;
    updatedAt?: string;
}
export interface CommentInstance extends Sequelize.Instance<CommentAttributes> {}

export interface CommentModel extends BaseModelInterface, Sequelize.Model<CommentInstance, CommentAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): CommentModel => {

    const Comment: CommentModel = sequelize.define('Comment', {
        // atributos que teremos em nossa tabela 'Comment' do banco de dados
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        // configura o nome da tabela
        tableName: 'comments'
    });

    // Abaixo fazemos as associações do nosso Model Comentário
    Comment.associate = (models: ModelsInterface): void => {

        // Um comentário pertence a um post
        Comment.belongsTo(models.Post, {
            // gera a chave estrangeira na nossa tabela comment
            foreignKey: {
                allowNull: false,   // não permite valor nulo
                field: 'post',   // o campo que vai ser criado na nossa tabela 'comments'
                name: 'post'    // nome da chave estrangeira
            }
        });

        // Um comentário pertence a um usuário
        Comment.belongsTo(models.User, {
            // gera a chave estrangeira na nossa tabela comment
            foreignKey: {
                allowNull: false,   // não permite valor nulo
                field: 'user',   // o campo que vai ser criado na nossa tabela 'comments'
                name: 'user'    // nome da chave estrangeira
            }
        });

    };

    return Comment;
};


