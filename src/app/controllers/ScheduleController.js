import {Op} from 'sequelize'
import {endOfDay, startOfDay,parseISO} from 'date-fns'
import User from '../models/user'
import Appointment from '../models/appointment'

class ScheduleController{

    async index(req, res){



        const checkUser = await User.findOne(
            {where: {id: req.userId, provider: true}
        })

        if(!checkUser){
            return res.status(404).json({message:'Esse usuário não é um colaborador!'})
        }

        const {date} = req.query;

        const paseDate = parseISO(date)

        const appointments = await Appointment.findAll({
            where:{
                collaborator_id: req.userId, 
                canceledAt: null,
                date:{
                    [Op.between]: [startOfDay(paseDate), endOfDay(paseDate)],
                },
            },
            order: ['date']
        });

        return res.json(appointments)
    }
}

export default new ScheduleController();