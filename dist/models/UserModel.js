"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
// Exporta uma instância definida que contem as interfaces acima implementadas
exports.default = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
    }, {
        tableName: 'users',
        hooks: {
            beforeCreate: (user, options) => {
                // Vamos criptografar a senha antes de salvar no banco
                const salt = bcryptjs_1.genSaltSync(); // gera um valor randomico que seráadicionado ao hash da senha do usuário.
                // critografando a senha do usuário
                user.password = bcryptjs_1.hashSync(user.password, salt);
            },
            beforeUpdate: (user, options) => {
                if (user.changed('password')) {
                    const salt = bcryptjs_1.genSaltSync();
                    user.password = bcryptjs_1.hashSync(user.password, salt);
                }
            }
        }
    });
    // Se quisermos fazer uma assciação entre Models
    User.associate = (models) => {
        // aqui fariamos as associações.
    };
    // Implementa os métodos
    User.prototype.isPassword = (encodePassword, password) => {
        // compara a senha aberta(password) com a senha criptografada(encodePassword).
        return bcryptjs_1.compareSync(password, encodePassword);
    };
    return User;
};
