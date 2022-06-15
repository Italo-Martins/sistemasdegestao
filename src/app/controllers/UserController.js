import User from '../models/user'
import * as Yup from 'yup'

class UserController{
    async store(req, res){

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(8),
        })

        if (!(await schema.isValid(req.body))){
            return res.status(400).json({message:'Falha na validação!'})
        }

        const userExists = await User.findOne({where: {email:req.body.email}});

        if(userExists){
            return res.status(400).json({error:'Usuário Já Cadastrado!'})
        }

        const {id, name, email, provider} = await User.create(req.body);


        return res.json({
            id,
            name,
            email,
            provider,
        })
    }

    async update(req,res){

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(8),
            password: Yup.string().required().min(8).when(
                'oldPassword', (oldPassword, field) => oldPassword ? field.required() : field
            ),
            confirmPassword: Yup.string().when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field)
        })

        if (!(await schema.isValid(req.body))){
            return res.status(400).json({message:'Falha na validação!'})
        }

        const {email, oldPassword} = req.body;

        const user = await User.findByPk(req.userId);
        console.log(req.userId)

        if(email != user.email){

            const userExists = await User.findOne({where: {email:req.body.email}});

            if(userExists){
                return res.status(400).json({error:'Usuário Já Cadastrado!'})
            }
        }

        if(oldPassword && !(await user.checkPassword(oldPassword))){ 
            return res.status(400).json({error:'Senha não confere!'})
        }

        const {id, name, provider} = await user.update(req.body)

        return res.json({
            id,
            name,
            email,
            provider,
        })
    }
}

export default new UserController()