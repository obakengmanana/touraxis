require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const Task = require('./models/Task');
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://user:touraxis@cluster0.whwia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Import Routes
const usersRoute = require('./routes/users');
const tasksRoute = require('./routes/tasks');


// Use Routes
app.use('/api/users', usersRoute);
app.use('/api/users/:userId/tasks', tasksRoute);


// Scheduled job to check pending tasks
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const tasks = await Task.find({ status: 'pending', date_time: { $lt: now } });
    tasks.forEach(async (task) => {
        console.log(`Task "${task.name}" is pending and should be done`);
        task.status = 'done';
        await task.save();
        console.log(`Task "${task.name}" is updated by cron to done`);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
