import * as Yup from "yup";
import {startOfHour, paseISO, isBefore, format} from 'date-fns';
import pt from 'date-fns/locale/pt-BR'
import Appointment from '../models/appointment';
import User from '../models/user';

import Notifications from '../schema/Notifications'

class AppointmentController{

    async index(req, res){

        const {page = 1} = req.query;

        const appointments = await Appointment.findAll({
            where: {
                user_id: req.Id,
                canceledAt: null
            }, 
            order: ['date'],
            attributes: ['id', 'date'],
            limit: 20,
            offset: (page - 1)*20,
            include:{
                model:User,
                as:'colaborador',
                attributes: ['id', 'name'],
                include:[{
                    model: File,
                    as: 'photo',
                    attributes: ['id', 'path', 'url']
                }]
            }
        })

        return res.json(appointments)
    }

    async store(req, res){

        const schema = Yup.object().shape({
            collaborator_id: Yup.number().required(),
            date: Yup.date().required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({err:'Inválido'})
        }

        const {collaborator_id, date} = req.body;

        const isCollaborator = await User.findOne({
            where: {id: collaborator_id, provider: true}
        })

        if(!isCollaborator){
            return res.status(401).json({error:'Colacorador não localizado!'})
        }

        const startHour = startOfHour(paseISO(date));

        if(isBefore(startHour,new Date())){
            return res.status(400).json({error:'Horário Não disponível!'})
        }

        const checkAvailability = await Appointment.findOne({
            where:{
                collaborator_id,
                canceledAt:null,
                date: startHour
            }
        })

        if(checkAvailability){
            return res.status(400).json({error:'Horário Não disponível, para esse colaborador!'})
        }

        const appointment = await Appointment.create({
            user_id: req.userId,
            collaborator_id,
            date: startHour
        })

        const user = await User.findByPk(req.userId);
        const formattedDate = format(startHour, " 'dia' dd 'de' MMMM', às' H:mm'h' ", {locale: pt})

        await Notifications.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: colaborador_id
        })

        return res.json(appointment)
    }
}

export default new AppointmentController();