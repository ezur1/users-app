import { Router } from 'express'
import {
  getSavedUsers,
  saveUser,
  updateUserName,
  deleteUser,
} from '../controllers/userController'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.get('/', asyncHandler(getSavedUsers))
router.post('/', asyncHandler(saveUser))
router.put('/:id', asyncHandler(updateUserName))
router.delete('/:id', asyncHandler(deleteUser))

export default router
