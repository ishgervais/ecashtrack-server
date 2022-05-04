import {Router} from 'express'
import { sendMail } from '../controllers/sendMail.controller'
// import { protect } from '../middlewares/auth';
const router = Router();

router.post('/send', sendMail)

 export default router
 