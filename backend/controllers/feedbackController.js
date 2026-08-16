const Feedback = require('../models/Feedback');
const demoStore = require('../services/demoStore');

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, score, comments = '' } = req.body;

    if (!name || !email || !score) {
      return res.status(400).json({ message: 'Name, email, and rating are required' });
    }

    const feedbackValues = {
      name,
      email,
      score: Number(score),
      comments,
    };
    const feedback = demoStore.databaseConnected()
      ? await Feedback.create(feedbackValues)
      : demoStore.saveFeedback(feedbackValues);

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
    const feedback = demoStore.databaseConnected()
      ? await Feedback.find().sort({ createdAt: -1 })
      : demoStore.feedbackHistory();
    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
