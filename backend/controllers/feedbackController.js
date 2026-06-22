const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, score, comments = '' } = req.body;

    if (!name || !email || !score) {
      return res.status(400).json({ message: 'Name, email, and rating are required' });
    }

    const feedback = await Feedback.create({
      name,
      email,
      score: Number(score),
      comments,
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeedbackHistory = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
