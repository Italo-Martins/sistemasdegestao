import  Sequelize  from "sequelize";
import mongoose from "mongoose";
import User from "../app/models/user";
import File from "../app/models/file";
import Appointment from "../app/models/appointment";
import databaseConfig from '../config/database';

const models = [User, File, Appointment];

class Database{
    constructor(){
        this.init();
        this.mongo();
    }

    init(){
        this.connection = new Sequelize(databaseConfig);
        models
            .map(model => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models));
    } 
    
    mongo(){
        this.mongoConnection = mongoose.connect(
            'mongodb+srv://sistemadeagendamento:sistemadeagendamento@cluster0.wbunu.mongodb.net/?retryWrites=true&w=majority',
            {useNewUrlParser: true, useUnifiedTopology: true},
        );
    }
}

export default new Database();
