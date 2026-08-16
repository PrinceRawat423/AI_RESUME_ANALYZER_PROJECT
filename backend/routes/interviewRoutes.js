const router = require('express').Router();
const interviewController = require('../controllers/interviewController');
const auth = require('../middleware/auth');

router.post('/questions', auth, interviewController.generateQuestions);
router.post('/chat', auth, interviewController.chat);

module.exports = router;
