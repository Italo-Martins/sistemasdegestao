import jwt from 'jsonwebtoken'
import {promisify} from 'util'
import authConfig from '../../config/auth'


export default async (req, res, next) =>{
    const authHeadres = req.headers.authorization

    if(!authHeadres){
        return res.status(401).json({message:'Para acessar este serviço é necessario estar logado!'})
    }

    const [ bearer, token ] = authHeadres.split(' ');

    try{

        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        req.userId = decoded.id;
        next();

    }catch(err){
        
        return res.status(401).json({message:'Token inválido!'})
    }
    

}