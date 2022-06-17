import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer'

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController';
import CollaboratorController from './app/controllers/CollaboratorController'
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationsController from './app/controllers/NotificationsController';

import authMiddleware from './app/middlewares/auth'

import Database from './database/index'




const routes = new Router();
const upload = multer(multerConfig);

routes.post('/user', UserController.store)
routes.post('/session', SessionController.store)

//Todos as rotas abaixos presisam ser autenticados
routes.use(authMiddleware)
routes.put('/user', UserController.update)

//Upload de arquivos.
routes.post('/files', upload.single('file'), FileController.store)

//Lista Colaboradores
routes.get('/collaborator', CollaboratorController.index)

// Lista de agendamentos
routes.get('/appointment', AppointmentController.index)

// Listagem de agendamentos colaborador
routes.get('/schedule', ScheduleController.index)

// Rota de agendamento
routes.post('/appointment', AppointmentController.store)

// Listagem de Notificações
routes.get('/notifications', NotificationsController.index)

// Marcar como lidar
routes.put('/notifications/:id', NotificationsController.update)

export default routes;