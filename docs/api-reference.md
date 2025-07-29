### API Endpoint Table

| Endpoint           | Method | Auth | Purpose                              |
| ------------------ | ------ | ---- | ------------------------------------ |
| /auth/register     | POST   | No   | Register a user (public/staff/admin) |
| /auth/login        | POST   | No   | Authenticate and get token           |
| /auth/logout       | POST   | No   | "Logout" (client removes token)      |
| /users/me          | GET    | Yes  | Get current user's profile           |
| /pets              | GET    | No   | List all pets (with filters)         |
| /pets              | POST   | Yes  | Add new pet (shelter staff only)     |
| /applications      | GET    | Yes  | View apps for pets (staff)           |
| /applications      | POST   | Yes  | Submit adoption app (public)         |
| /applications/mine | GET    | Yes  | User’s submitted applications        |
| /shelters          | GET    | No   | List all shelters (public)           |

### API Endpoint Reference (Simplified)

#### `/auth/register` — `POST`

- Description: Register as a public user, shelter staff, or admin
- Auth Required: No
- Request Body:
  - `email`: string (valid email required)
  - `password`: string (min 8 chars, at least one uppercase, one lowercase, and one digit)
  - `role`: enum [Public, ShelterStaff, Admin]
  - `shelterId`: integer (required if registering as ShelterStaff)

---

#### `/auth/login` — `POST`

- Description: Log in and receive JWT token
- Auth Required: No
- Request Body:
  - `email`: string
  - `password`: string

---

#### `/pets` — `GET`

- Description: List all adoptable pets (with filters)
- Auth Required: No
- Query Parameters (optional):
  - `type`, `ageGroup`, `shelterId`

---

#### `/auth/logout` — `POST`

- Description: Logout user (client must remove the JWT token)
- Auth Required: No
- Request Body: None

---

#### `/users/me` — `GET`

- Description: Get the profile of the currently authenticated user
- Auth Required: Yes (Bearer token)
- Response:
  - `id`: integer
  - `email`: string
  - `role`: string

---

#### `/pets` — `POST`

- Description: Add a new pet listing (shelter staff only)
- Auth Required: Yes
- Request Body:
  - `name`: string
  - `type`: string
  - `ageGroup`: string
  - `description`: string
  - `imageFileName`: string — name of uploaded image file (e.g., `fluffy01.jpg`)
  - `shelterId`: integer

> 📝 **Note**: The `imageFileName` is not a full URL. Construct full image path as `/images/{imageFileName}`.

---

#### `/applications` — `GET`

- Description: View applications for pets you manage (staff only)
- Auth Required: Yes (ShelterStaff)
- Request Body: None

---

#### `/applications` — `POST`

- Description: Submit an adoption application
- Auth Required: Yes (Public)
- Request Body:
  - `petId`: integer
  - `message`: string (optional)

---

#### `/applications/mine` — `GET`

- Description: View applications submitted by the logged-in user
- Auth Required: Yes (Public)

---

#### `/shelters` — `GET`

- Description: List all shelters (optional use)
- Auth Required: No
