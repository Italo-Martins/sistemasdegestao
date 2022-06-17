import User from '../models/user'
import File from '../models/file'

class CollaboratorController{
    async index(req, res){

        const collaborator = await User.findAll({
            where: {provider:true},
            attributes: ['id', 'name', 'email', 'photo_id'],
            include: [{
                model: File,
                as: 'photo',
                attributes: ['name', 'path', 'url']
            }]
        })

        return res.json(collaborator)
    }
}

export default new CollaboratorController();