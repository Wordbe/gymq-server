import express from 'express';
import equipmentRoutes from './routes/equipment.js';
import userRoutes from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('/equipment', equipmentRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GymQ Server API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;