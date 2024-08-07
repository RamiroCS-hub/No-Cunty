/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { UserCtrl } from '../controller/user.ctrl'
import { ParentCtrl } from '../controller/parent.ctrl'
import { DashboardCtrl } from '../controller/dashboard.ctrl'
const userCtrl = new UserCtrl()
const parentCtrl = new ParentCtrl()
const dashboardctrl = new DashboardCtrl()
const router: Router = Router()

router.get('/users', userCtrl.getAllUsers)
router.get('/active-students', userCtrl.getActiveUsersByTypeUser)
router.get('/parents', parentCtrl.getAllParents)
router.get('/dashboard', dashboardctrl.getDashboardData)
router.get('/parents-not-registered', parentCtrl.getParentsNotAssociated)

router.post('/create-user', userCtrl.createUser)
router.post('/create-parent', parentCtrl.createParent)

router.put('/update-user/:id', userCtrl.updateUser)
router.put('/update-parent/:parentId', parentCtrl.updateParent)
router.delete('/delete-user/:id', userCtrl.softDeleteUser)

router.patch('/restore-user/:id', userCtrl.restoreUser)
export default router
