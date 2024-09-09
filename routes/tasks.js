const express = require('express');
const router = express.Router({ mergeParams: true });
const Task = require('../models/Task');

// Create task for user
router.post('/', async (req, res) => {
    try {
        const task = new Task({ ...req.body, user_id: req.params.userId });
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// List tasks for user
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user_id: req.params.userId });
        res.status(200).send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get task info
router.get('/:taskId', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.taskId, user_id: req.params.userId });
        if (!task) return res.status(404).send();
        res.status(200).send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update task
router.put('/:taskId', async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.taskId, user_id: req.params.userId },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).send();
        res.status(200).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete task
router.delete('/:taskId', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.taskId, user_id: req.params.userId });
        if (!task) return res.status(404).send();
        res.status(200).send({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
