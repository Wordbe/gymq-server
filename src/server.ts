import express from 'express';
import equipmentRoutes from './routes/equipment.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('/equipment', equipmentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GymQ Server API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;