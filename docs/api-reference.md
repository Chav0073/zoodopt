# Zoodopt API Reference

### API Endpoint Table

| Endpoint                   | Method | Auth | Purpose                                    |
| -------------------------- | ------ | ---- | ------------------------------------------ |
| /auth/register             | POST   | No   | Register a user (public/staff/admin)       |
| /auth/login                | POST   | No   | Authenticate and get token                 |
| /auth/logout               | POST   | No   | "Logout" (client removes token)            |
| /users/me                  | GET    | Yes  | Get current user's profile                 |
| /pets                      | GET    | No   | List all pets (with filters)               |
| /pets/{id}                 | GET    | No   | Get specific pet details                   |
| /pets                      | POST   | Yes  | Add new pet (shelter staff/admin)          |
| /pets/{id}                 | PUT    | Yes  | Update pet (shelter staff/admin)           |
| /pets/{id}                 | DELETE | Yes  | Delete pet (shelter staff/admin)           |
| /applications              | GET    | Yes  | View apps for shelter's pets (staff/admin) |
| /applications/{id}         | GET    | Yes  | Get specific application details           |
| /applications              | POST   | Yes  | Submit adoption app (any authenticated)    |
| /applications/{id}/message | PUT    | Yes  | Update application message (applicant)     |
| /applications/{id}/status  | PUT    | Yes  | Update app status (staff/admin)            |
| /applications/{id}         | DELETE | Yes  | Delete application (applicant/admin)       |
| /shelters                  | GET    | No   | List all shelters (public)                 |
| /shelters/{id}             | GET    | No   | Get specific shelter details               |
| /shelters                  | POST   | Yes  | Create shelter (admin only)                |
| /shelters/{id}             | PUT    | Yes  | Update shelter (admin only)                |
| /shelters/{id}             | DELETE | Yes  | Delete shelter (admin only)                |

## Authentication

All endpoints marked with "Auth: Yes" require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Error message description",
  "timestamp": "2025-07-31T12:00:00.000Z"
}
```

Common HTTP status codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)

---

## API Endpoint Details

### Authentication Endpoints

#### `/auth/register` — `POST`

- **Description**: Register as a public user, shelter staff, or admin
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123",
    "role": "Public",
    "shelterId": 1
  }
  ```
- **Fields**:
  - `email`: string (valid email required)
  - `password`: string (min 8 chars, at least one uppercase, one lowercase, and one digit)
  - `role`: enum [`Public`, `ShelterStaff`, `Admin`]
  - `shelterId`: integer (required if registering as ShelterStaff)
- **Response**: `200 OK` with auth token and user info

---

#### `/auth/login` — `POST`

- **Description**: Log in and receive JWT token
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response**: `200 OK` with auth token and user info

---

#### `/auth/logout` — `POST`

- **Description**: Logout user (client must remove the JWT token)
- **Auth Required**: No
- **Request Body**: None
- **Response**: `200 OK` with logout confirmation

---

### User Endpoints

#### `/users/me` — `GET`

- **Description**: Get the profile of the currently authenticated user
- **Auth Required**: Yes (Bearer token)
- **Response**:
  ```json
  {
    "id": 1,
    "email": "user@example.com",
    "role": "Public",
    "shelterId": 1,
    "shelterName": "Happy Paws Shelter"
  }
  ```

---

### Pet Endpoints

#### `/pets` — `GET`

- **Description**: List all adoptable pets (with optional filters)
- **Auth Required**: No
- **Query Parameters** (optional):
  - `type`: string (filter by pet type, e.g., "dog", "cat")
  - `ageGroup`: string (filter by age group, e.g., "puppy", "adult")
  - `shelterId`: integer (filter by shelter)
- **Response**: Array of pet objects with shelter information

---

#### `/pets/{id}` — `GET`

- **Description**: Get details for a specific pet
- **Auth Required**: No
- **Response**: Pet object with shelter information

---

#### `/pets` — `POST`

- **Description**: Add a new pet listing (shelter staff and admin only)
- **Auth Required**: Yes (ShelterStaff or Admin)
- **Request Body**:
  ```json
  {
    "name": "Fluffy",
    "type": "Cat",
    "ageGroup": "Adult",
    "description": "Friendly and playful cat",
    "imageFileName": "fluffy01.jpg",
    "shelterId": 1
  }
  ```
- **Note**: Shelter staff can only create pets for their own shelter

---

#### `/pets/{id}` — `PUT`

- **Description**: Update an existing pet
- **Auth Required**: Yes (ShelterStaff or Admin)
- **Request Body**:
  ```json
  {
    "name": "Fluffy Updated",
    "type": "Cat",
    "ageGroup": "Senior",
    "description": "Updated description",
    "imageFileName": "fluffy02.jpg"
  }
  ```
- **Note**: Shelter staff can only update pets from their own shelter

---

#### `/pets/{id}` — `DELETE`

- **Description**: Delete a pet listing
- **Auth Required**: Yes (ShelterStaff or Admin)
- **Response**: `204 No Content`
- **Note**: Cannot delete pets with existing applications

---

### Application Endpoints

#### `/applications` — `GET`

- **Description**: View applications for pets (shelter staff and admin only)
- **Auth Required**: Yes (ShelterStaff or Admin)
- **Response**: Array of applications (shelter staff see only their shelter's applications)

---

#### `/applications/{id}` — `GET`

- **Description**: Get details for a specific application
- **Auth Required**: Yes
- **Response**: Application details
- **Note**: Users can only view their own applications, staff can view applications for their shelter's pets

---

#### `/applications` — `POST`

- **Description**: Submit an adoption application
- **Auth Required**: Yes (any authenticated user)
- **Request Body**:
  ```json
  {
    "petId": 1,
    "message": "I would love to adopt this pet!"
  }
  ```
- **Note**: Cannot submit duplicate applications for the same pet

---

#### `/applications/{id}/message` — `PUT`

- **Description**: Update application message (applicant only)
- **Auth Required**: Yes
- **Request Body**:
  ```json
  {
    "message": "Updated message about why I want to adopt"
  }
  ```

---

#### `/applications/{id}/status` — `PUT`

- **Description**: Update application status (shelter staff and admin only)
- **Auth Required**: Yes (ShelterStaff or Admin)
- **Request Body**:
  ```json
  {
    "status": "Approved"
  }
  ```
- **Valid statuses**: Pending, Approved, Rejected

---

#### `/applications/{id}` — `DELETE`

- **Description**: Delete an application
- **Auth Required**: Yes
- **Response**: `204 No Content`
- **Note**: Applicants can delete their own applications, admins can delete any

---

### Shelter Endpoints

#### `/shelters` — `GET`

- **Description**: List all shelters
- **Auth Required**: No
- **Response**: Array of shelter objects with pet counts

---

#### `/shelters/{id}` — `GET`

- **Description**: Get details for a specific shelter
- **Auth Required**: No
- **Response**: Shelter object with pet count

---

#### `/shelters` — `POST`

- **Description**: Create a new shelter (admin only)
- **Auth Required**: Yes (Admin only)
- **Request Body**:
  ```json
  {
    "name": "New Animal Shelter",
    "location": "123 Pet Street, City, State"
  }
  ```

---

#### `/shelters/{id}` — `PUT`

- **Description**: Update an existing shelter (admin only)
- **Auth Required**: Yes (Admin only)
- **Request Body**:
  ```json
  {
    "name": "Updated Shelter Name",
    "location": "456 New Address, City, State"
  }
  ```

---

#### `/shelters/{id}` — `DELETE`

- **Description**: Delete a shelter (admin only)
- **Auth Required**: Yes (Admin only)
- **Response**: `204 No Content`
- **Note**: Cannot delete shelters with existing pets or staff members

---

## Data Transfer Objects (DTOs)

### Pet Response

```json
{
  "id": 1,
  "name": "Fluffy",
  "type": "Cat",
  "ageGroup": "Adult",
  "description": "Friendly cat",
  "imageFileName": "fluffy.jpg",
  "shelterId": 1,
  "shelterName": "Happy Paws Shelter"
}
```

### Application Response

```json
{
  "id": 1,
  "petId": 1,
  "userId": 2,
  "message": "I'd love to adopt!",
  "status": "Pending",
  "submittedAt": "2025-07-31T12:00:00Z",
  "petName": "Fluffy"
}
```

### Shelter Response

```json
{
  "id": 1,
  "name": "Happy Paws Shelter",
  "location": "123 Pet Street",
  "petCount": 15
}
```

### User Profile Response

```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "Public",
  "shelterId": 1,
  "shelterName": "Happy Paws Shelter"
}
```
