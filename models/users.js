const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: false
            },
            nickname: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            isAllowAd: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            provider: {
                type: Sequelize.STRING(20),
                allowNull: false,
                defaultValue: 'local'
            }
        }, 
        {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        })
    }

    static associate(db){
        db.User.hasMany(db.Board);
    }
}