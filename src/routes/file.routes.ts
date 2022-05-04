import {Router} from 'express'
import { FileController } from '../controllers/file.controller'
import { protect } from '../middlewares/auth';
import upload from '../config/multer.config';

const router = Router();
const fileController = new FileController()


 /**
 * @param id UserID
 */
  router.post('/upload/:id/page', protect, upload.single('file'), fileController.upload)



 export default router
 