## Form


This project renders a single-page dynamic form based on a hierarchical question catalog. Questions can be nested and tables are supported as question containers.
## Tech Stack

* **Frontend:** React, Vite, React Testing Library
* **Backend:** Java, Spring Boot, JPA/Hibernate
* **Database:** H2

---

## Getting Started

### Prerequisites

* Node.js >= 20.x
* Java JDK 17+ required for the backend.  
  Recommended: download the installer from [Adoptium](https://adoptium.net/fr/temurin/releases?version=17&os=any&arch=any) and follow the instructions for your OS. After installation, verify with:
  ```bash
  java -version
  javac -version

### Installation

```bash
# Clone repo
git clone https://github.com/SoniaHM/form.git
cd form

# Frontend
cd frontend
npm install
```

---

## Running the App

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`
