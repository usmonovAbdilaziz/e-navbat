import {Router} from 'express';
import AdminController from '../controllers/admin.controller.js';

const router = Router();
     
const { createAdmin,getAdmins,getAdminById,updateAdmin ,deleteAdmin} = AdminController;

router.post('/',createAdmin).get('/',getAdmins).get('/:id',getAdminById).patch('/:id',updateAdmin).delete('/:id',deleteAdmin);

export default router;