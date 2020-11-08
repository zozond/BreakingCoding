const Sequelize = require('sequelize');

module.exports = class Board extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            authorId:{
                type: Sequelize.INTEGER,
                allowNull: false
            },
            author: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            title: {
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: false
            },
            content: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
        }, 
        {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Board',
            tableName: 'boards',
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        })
    }

    static associate(db){
        db.Board.belongsTo(db.User);
    }
}