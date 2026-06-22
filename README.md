# AI Resume Analyzer Project

This repository contains two runnable versions of the project:

- `App/App.py` - a Streamlit version that matches the original GitHub repo closely
- `frontend/` and `backend/` - the React + Node version

## Streamlit Version

Run from `App/`:

```bash
pip install -r requirements.txt
streamlit run App.py
```

## React + Node Version

Run from the repository root:

```bash
npm install
npm run dev
```

## Notes

- `backend/.env` and `frontend/.env` are local-only and ignored by git
- MongoDB is used for the Node version
- MySQL support is included in the Streamlit version for parity with the original project
