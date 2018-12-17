"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
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
    Comment.associate = (models) => {
        // Um comentário pertence a um post
        Comment.belongsTo(models.Post, {
            // gera a chave estrangeira na nossa tabela comment
            foreignKey: {
                allowNull: false,
                field: 'post',
                name: 'post' // nome da chave estrangeira
            }
        });
        // Um comentário pertence a um usuário
        Comment.belongsTo(models.User, {
            // gera a chave estrangeira na nossa tabela comment
            foreignKey: {
                allowNull: false,
                field: 'user',
                name: 'user' // nome da chave estrangeira
            }
        });
    };
    return Comment;
};
