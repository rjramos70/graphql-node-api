import * as Sequelize from "sequelize";
import { BaseModelInterface } from '../interfaces/BaseModelInterface';
import { ModelsInterface } from "../interfaces/ModelsInterface";

export interface PostAttributes {
    id?: number;
    title?: string;
    content?: string;
    photo?: string;
    author?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface PostInstance extends Sequelize.Instance<PostAttributes> {}

export interface PostModel extends BaseModelInterface, Sequelize.Model<PostInstance, PostAttributes> {}

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): PostModel => {
    const Post: PostModel = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        photo: {
            type: DataTypes.BLOB({
                length: 'long'
            }),
            allowNull: false
        }
    },{
        tableName: 'posts'
    });

    // Associando PostModel com o UserModel
    Post.associate = (models: ModelsInterface): void => {
        // Um Post pertence a um User;
        Post.belongsTo(models.User, {
            foreignKey: {       // Parametros da associação do belongsTo
                allowNull: false,
                field: 'author',    // o nome dado a coluna
                name: 'author'      // nome da foreing key será 'author'.
            }
        });    
    }

    return Post;
}