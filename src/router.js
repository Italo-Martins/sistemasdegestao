import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer'

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth'




const routes = new Router();
const upload = multer(multerConfig);

routes.post('/user', UserController.store)
routes.post('/session', SessionController.store)

//Todos as rotas abaixos presisam ser autenticados
routes.use(authMiddleware)
routes.put('/user', UserController.update)

//Upload de arquivos.
routes.post('/files', upload.single('file'), FileController.store)

export default routes;