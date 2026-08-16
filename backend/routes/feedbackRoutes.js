const router = require('express').Router();
const feedbackController = require('../controllers/feedbackController');

router.post('/submit', feedbackController.submitFeedback);
router.get('/history', feedbackController.getFeedbackHistory);

module.exports = router;
