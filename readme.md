# 📚 Kids Reading Practice webapp with AI



## 📁 Project Setup

Follow the steps below to set up the project locally using `conda` and `pip`.

---

### 🔧 1. Clone the Repository

```bash
git clone https://github.com/biplob004/studyWizard.git
cd studyWizard
````

---

### 🐍 2. Create a Conda Environment

```bash
conda create --name wizard python=3.11
conda activate wizard
```

Replace `wizard` with a name you prefer for the environment.

---

### 📦 3. Install Dependencies from `server/requirements.txt`

```bash
cd server
pip install -r requirements.txt
```


## 🏁 Getting Started

Run the command from server directory to start fast api server

```bash
python main.py
```



![Landing page](assets/landing-page.png)

![Study page](assets/study-page.png)

---

Create `.env` file in `server` directory

```bash
OPENAI_API_KEY='<Your openai api key here>'

# Your fastapi API url
server_base_url = 'http://localhost:8000'

```

---

How to start nextjs client server

Run the following command from `client` directory

```bash
npm install
npm run dev
```

Then, Open `http://localhost:3000` in your browser to view the app.
