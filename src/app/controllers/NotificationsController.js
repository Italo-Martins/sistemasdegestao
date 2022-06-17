import User from '../models/user'
import Notifications from '../schema/Notifications'

class NotificationsController{
    async index(req, res){

        const checkIsCollection = await User.findOne({
            where: {id: req.userId, provider: true}
        })

        if(!checkIsCollection){
            return res.status(401).json({error: 'Notificação disponível apenas para colaboradores!'})
        }

        const notifications = await Notification.find({
            user: req.userId,
        }).sort({createdAt:'desc'}).limit(20)

        return res.json(notifications)
    }

    async update(req, res){

        const notifications = await Notifications.findByIdAndUpdate(
            req.params.id,
            {read: true},
            {new: true},

        )

        return res.json()
    }
}

export default new NotificationsController();