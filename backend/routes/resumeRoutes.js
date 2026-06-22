const router = require('express').Router();
const resumeController = require('../controllers/resumeController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

router.post('/upload', auth, upload.single('resume'), resumeController.uploadResume);
router.post('/analyze', auth, resumeController.analyzeResume);
router.get('/history', auth, resumeController.getHistory);
router.get('/latest', auth, resumeController.getLatestAnalysis);

module.exports = router;
