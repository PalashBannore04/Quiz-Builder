# Quiz Builder - Full-Stack Online Examination Platform

A production-ready, full-stack online examination and assessment platform featuring Spring Boot 3, Spring Security with stateless JWT, MySQL 8, and a React 18 (Vite) single-page application built with clean, responsive Vanilla CSS.

---

## Key Highlights & Core Business Rules
- **Strict 2-Attempt Quota Per Domain**: Each candidate is permitted at most 2 attempts per category.
  - **Attempt 1**: Baseline performance assessment.
  - **Attempt 2**: Final retake.
  - **Attempt 3+**: Strictly blocked on the server (`409 Conflict` / `AttemptLimitExceededException`).
- **Server-Side Integrity & Timer Validation**: Real-time timer in the examination room with auto-submission upon expiry. The backend validates timestamps with a grace threshold to prevent client-side manipulation.
- **Zero Answer Leakage**: Questions provided to candidates strictly omit `correctOption` and `explanation` until submission.
- **Answer Review & Delta Analytics**: Instant post-submission breakdown featuring color-coded answer comparisons, comprehensive rationales, and an administrator submission tracker computing score deltas (`Latest Score - Baseline Score`).
- **Curriculum & Question Bank CRUD**: Complete domain and 4-option item management with filtering and database reset capability.

---

## Project Structure

```
Quiz-Builder/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/quizbuilder/
│       │   │   ├── QuizBuilderApplication.java
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java
│       │   │   │   ├── CategoryController.java
│       │   │   │   ├── QuestionController.java
│       │   │   │   ├── AttemptController.java
│       │   │   │   └── AdminController.java
│       │   │   ├── service/
│       │   │   │   ├── AuthService.java
│       │   │   │   ├── CategoryService.java
│       │   │   │   ├── QuestionService.java
│       │   │   │   ├── AttemptService.java
│       │   │   │   ├── AdminService.java
│       │   │   │   └── SeedDataService.java
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java
│       │   │   │   ├── CategoryRepository.java
│       │   │   │   ├── QuestionRepository.java
│       │   │   │   ├── AttemptRepository.java
│       │   │   │   └── AttemptAnswerRepository.java
│       │   │   ├── entity/
│       │   │   │   ├── User.java
│       │   │   │   ├── Category.java
│       │   │   │   ├── Question.java
│       │   │   │   ├── Attempt.java
│       │   │   │   └── AttemptAnswer.java
│       │   │   ├── dto/
│       │   │   │   ├── AuthRequest.java
│       │   │   │   ├── RegisterRequest.java
│       │   │   │   ├── AuthResponse.java
│       │   │   │   ├── UserDTO.java
│       │   │   │   ├── CategoryDTO.java
│       │   │   │   ├── CategorySummaryDTO.java
│       │   │   │   ├── CategoryCreateUpdateDTO.java
│       │   │   │   ├── QuestionDTO.java
│       │   │   │   ├── QuestionAdminDTO.java
│       │   │   │   ├── QuestionCreateUpdateDTO.java
│       │   │   │   ├── StartQuizResponseDTO.java
│       │   │   │   ├── SubmitQuizRequestDTO.java
│       │   │   │   ├── QuestionAnswerInputDTO.java
│       │   │   │   ├── AttemptResultDTO.java
│       │   │   │   ├── AttemptAnswerReviewDTO.java
│       │   │   │   ├── AttemptHistoryDTO.java
│       │   │   │   ├── AdminDashboardStatsDTO.java
│       │   │   │   ├── AdminSubmissionTrackerDTO.java
│       │   │   │   ├── AdminCandidateSummaryDTO.java
│       │   │   │   ├── AdminDomainPerformanceDTO.java
│       │   │   │   └── ApiResponse.java
│       │   │   ├── security/
│       │   │   │   ├── JwtTokenProvider.java
│       │   │   │   ├── CustomUserDetailsService.java
│       │   │   │   ├── JwtAuthenticationFilter.java
│       │   │   │   └── SecurityConfig.java
│       │   │   └── exception/
│       │   │       ├── GlobalExceptionHandler.java
│       │   │       ├── ResourceNotFoundException.java
│       │   │       ├── BadRequestException.java
│       │   │       ├── AttemptLimitExceededException.java
│       │   │       └── ErrorResponse.java
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── schema.sql
│       │       └── seed.sql
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   ├── axiosClient.js
│       │   └── endpoints.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── routes/
│       │   └── ProtectedRoute.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Modal.jsx
│       │   └── QuestionPalette.jsx
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── AuthPage.jsx
│       │   ├── CandidateDashboard.jsx
│       │   ├── QuizRoom.jsx
│       │   ├── ResultReview.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── QuestionManager.jsx
│       └── styles/
│           ├── index.css
│           ├── auth.css
│           ├── dashboard.css
│           ├── quiz.css
│           ├── review.css
│           └── admin.css
├── schema.sql
├── seed.sql
└── README.md
```

---

## Seed Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Candidate** | `user@quizbuilder.com` | `user123` | Domains Dashboard, Quizzes, History, Review |
| **Administrator** | `admin@quizbuilder.com` | `admin123` | Analytics, Tracker, Audit, Question & Domain CRUD |

*(The frontend includes 1-click credential quick-fill buttons for both accounts.)*

---

## Quickstart with Docker Compose 🐳

You can spin up the entire application stack (MySQL 8 database, Spring Boot backend, and React Nginx frontend) with a single command:

```bash
docker compose up --build
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:8080/api`
- **MySQL Database**: `localhost:3306` (Database: `quiz_builder`, Password: `rootpassword`)

---

## Local Development Prerequisites
1. **Java Development Kit (JDK)**: Java 17 or higher (`java -version`)
2. **Apache Maven**: Version 3.8+ (`mvn -version`)
3. **Node.js**: Version 18+ and npm (`node -v`, `npm -v`)
4. **MySQL Server**: MySQL 8.0+ running on port `3306`

---

## Database Setup (Local)

1. Log into your MySQL console:
   ```bash
   mysql -u root -p
   ```
2. Run `schema.sql` and `seed.sql`:
   ```sql
   SOURCE schema.sql;
   SOURCE seed.sql;
   ```
   *(Alternatively, the backend Spring Boot `SeedDataService` automatically initializes all tables, default accounts, 6 categories, and 30 questions on startup if the database is empty).*

3. Verify or update connection credentials in:
   `backend/src/main/resources/application.properties`
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/quiz_builder?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=
   ```

---

## Step-by-Step Run Instructions (Without Docker)

### 1. Run Backend (Spring Boot 3)
In a terminal, navigate to the `backend` directory and start the application:

```bash
cd backend
mvn spring-boot:run
```
- The backend server will initialize on: **`http://localhost:8080`**
- REST endpoints are prefixed with `/api`

### 2. Run Frontend (React 18 + Vite)
In a second terminal, navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```
- The frontend will launch at: **`http://localhost:5173`**
- API requests to `/api` are automatically proxied to `http://localhost:8080`

---

## Verification & Testing Checklist

Execute these 6 verification steps to confirm end-to-end functionality:

1. **Candidate Registration & Login**:
   - Navigate to `http://localhost:5173/login`.
   - Click the **"Candidate"** quick-fill chip (`user@quizbuilder.com` / `user123`) or click **"Register Here"** to register a new account.
   - Confirm successful sign in and redirection to `/dashboard`.

2. **Domain Dashboard & Quota Status**:
   - Inspect the 6 categories (Java, Web Development, Python, SQL, Data Structures, Logic).
   - Observe that Java shows `2/2 Used` (Locked) due to initial seed data, while the other 5 categories show `0/2 Used` with an active **"Start Quiz (Attempt 1)"** button.

3. **Take Quiz (Attempt 1 - Baseline)**:
   - Click **"Start Quiz"** on "Web Development & Architecture".
   - Notice the live countdown timer (`06:00`), interactive question palette (1-5), and keyboard shortcuts (`1-4` or `A-D` to choose options, `ArrowLeft` / `ArrowRight` to navigate).
   - Answer the questions and click **"Review & Submit"**. Confirm in the submission modal.
   - Verify redirection to `/results/:attemptId` displaying score, percentage, color-coded comparison (green correct vs red chosen), and in-depth explanations.

4. **Retake Quiz (Attempt 2 - Final Retake)**:
   - Return to `/dashboard`.
   - Observe that the Web Development domain card now displays `Attempts: 1/2`, shows your **Baseline score**, and the action button has updated to **"Retake Quiz (Final Attempt)"**.
   - Click **"Retake Quiz"** and complete attempt 2.
   - Verify the retake result review displays the `Attempt 2: Final Retake` badge.

5. **Attempt 3 Enforced Block**:
   - Return to `/dashboard`.
   - Observe the Web Development domain card is now **"Locked (2/2 Used)"** with disabled button.
   - If a malicious client attempts to call `POST /api/attempts/start/2` directly, the backend returns:
     ```json
     {
       "status": 409,
       "error": "Attempt Limit Exceeded",
       "message": "You have reached the maximum allowed attempts (2/2) for 'Web Development & Architecture'. Attempt limit enforced."
     }
     ```

6. **Admin Analytics, Score Delta & Role Security**:
   - Log out and log in as Administrator (`admin@quizbuilder.com` / `admin123`).
   - Navigate to `/admin/dashboard`.
   - Observe the 4 KPI cards (Total Domains, Active Questions, Registered Candidates, Evaluations Evaluated).
   - Inspect the **Submission Tracker**: verify the row for Candidate shows:
     - Attempt Quota: `2/2`
     - Previous Attempt: Baseline score (e.g., `3/5`)
     - Latest Attempt: Retake score (e.g., `5/5`)
     - **Score Delta**: Displayed in color (e.g., `+2 Imprv`).
   - Click **"View Audit"** to view candidate choices vs correct answers.
   - Role Security Check: Log in as a Candidate and attempt to navigate to `http://localhost:5173/admin/dashboard` or call `/api/admin/stats`; confirm immediate redirection and HTTP 403 Forbidden rejection.
