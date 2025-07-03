import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './models/index.js';
import userRouter from './routes/userRoutes.js';


dotenv.config({ path: './config/.env' });




const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRouter);

app.get('/', (req, res) => {
  res.send('✅ Server is running and connected to Sequelize');
});

// Sync DB and start server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synced');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Database sync failed:', err);
});
