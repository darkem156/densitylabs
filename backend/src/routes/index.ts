import { Router } from 'express'
import commentsRouter from './comment'

const router = Router()

router.get('/', (req, res) => {
  res.send('Hello World')
})

router.use('/comments', commentsRouter)

export default router
