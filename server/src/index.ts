import express from 'express'
import cors from 'cors'
import randomUsersRouter from './routes/randomUsers'
import usersRouter from './routes/users'
import { errorHandler } from './middleware/error'

const app = express()
const PORT = Number(process.env.PORT ?? 3000)
const CLIENT_URL = process.env.CLIENT_URL

app.use(
  cors({
    origin: CLIENT_URL ? [CLIENT_URL] : true,
  }),
)
app.use(express.json())

app.use('/api/random-users', randomUsersRouter)
app.use('/api/users', usersRouter)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
