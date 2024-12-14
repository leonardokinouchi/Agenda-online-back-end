// Importing dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('./routes/userRoute');
const taskRoutes = require('./routes/tasksRoute');

require('dotenv').config();

// Creating the Express app
const app = express();
//database uri
const uri = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_SENHA}@cluster0.s0usx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//Conexão com o banco de dados
(async () => {
  try {
    // String de conexão ao MongoDB
    const connectionString = uri
  
    // Tentativa de conexão
    await mongoose.connect(connectionString);
    console.log('Conexão ao banco de dados realizada com sucesso!');

  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
  }
})();

// Middleware
app.use(express.json())
app.use(cors())

// Attach user-related routes
app.use('/api/users', userRoutes);

app.use('/api/tasks', taskRoutes); // Task-related routes


// Routes
app.get('/', (req, res) => {
  res.status(200).send('Backend funcionando! 🚀');
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
})
