import { Router } from 'express'
import { getRandomUsers } from '../controllers/userController'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.get('/', asyncHandler(getRandomUsers))

export default router
