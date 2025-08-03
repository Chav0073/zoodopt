# Zoodopt API Reference

## Overview

The Zoodopt API provides endpoints for managing pet adoption applications, shelters, and users. The API uses JWT tokens for authentication and follows RESTful conventions.

**Base URL:** `http://localhost:5217`

### API Endpoint Table

| Endpoint                      | Method | Auth | Purpose                                                 |
| ----------------------------- | ------ | ---- | ------------------------------------------------------- |
| /auth/register                | POST   | No\* | Register a user (public self-reg, admin for privileged) |
| /auth/login                   | POST   | No   | Authenticate and get token                              |
| /users/me                     | GET    | Yes  | Get current user's profile                              |
| /pets                         | GET    | No   | List all pets (with filters)                            |
| /pets/{id}                    | GET    | No   | Get specific pet details                                |
| /pets                         | POST   | Yes  | Add new pet (shelter staff/admin)                       |
| /pets/{id}                    | PUT    | Yes  | Update pet (shelter staff/admin)                        |
| /pets/{id}                    | DELETE | Yes  | Delete pet (shelter staff/admin)                        |
| /applications                 | GET    | Yes  | View apps for shelter's pets (staff/admin)              |
| /applications/my-applications | GET    | Yes  | Get current user's own applications                     |
| /applications/{id}            | GET    | Yes  | Get specific application details                        |
| /applications                 | POST   | Yes  | Submit adoption app (any authenticated)                 |
| /applications/{id}/message    | PUT    | Yes  | Update application message (applicant)                  |
| /applications/{id}/status     | PUT    | Yes  | Update app status (staff/admin)                         |
| /applications/{id}            | DELETE | Yes  | Delete application (applicant/admin)                    |
| /shelters                     | GET    | No   | List all shelters (public)                              |
| /shelters/{id}                | GET    | No   | Get specific shelter details                            |
| /shelters                     | POST   | Yes  | Create shelter (admin only)                             |
| /shelters/{id}                | PUT    | Yes  | Update shelter (admin only)                             |
| /shelters/{id}                | DELETE | Yes  | Delete shelter (admin only)                             |

\* Public registration allows only "Public" role. Admin/ShelterStaff accounts require admin authentication.

## Authentication

### JWT Token Authentication

All endpoints marked with "Auth: Yes" require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **Public**: Can view pets/shelters, submit applications
- **ShelterStaff**: Can manage pets for their assigned shelter, manage applications
- **Admin**: Full access to all resources

### Security Features

- **Role-Based Access**: Endpoints are protected by role-based authorization
- **Registration Security**: Only admin users can create Admin or ShelterStaff accounts; public registration is limited to "Public" role
- **Shelter Isolation**: ShelterStaff users can only manage pets and applications for their assigned shelter
- **Application Privacy**: Users can only view their own applications (except staff/admin viewing their shelter's applications)

## Data Models

### Pet Model

```json
{
  "id": 1,
  "name": "Bella",
  "type": "Dog",
  "ageGroup": "Adult",
  "breed": "Labrador Retriever",
  "gender": "Female",
  "status": "Available",
  "description": "Friendly and energetic...",
  "imageFileName": "bella.jpg",
  "imageUrl": "/images/bella.jpg",
  "shelterId": 1,
  "shelterName": "Happy Tails Shelter"
}
```

**Pet Status Values:**

- `Available` - Ready for adoption
- `Pending` - Has pending application(s)
- `Adopted` - Successfully adopted

### Shelter Model

```json
{
  "id": 1,
  "name": "Happy Tails Shelter",
  "location": "Toronto, ON",
  "phone": "416-555-0101",
  "email": "contact@happytails.ca",
  "description": "We specialize in dogs and rabbits...",
  "logo": "happytails.png",
  "petCount": 2
}
```

### Application Model

```json
{
  "id": 1,
  "petId": 1,
  "userId": 5,
  "message": "I would love to adopt Bella!",
  "status": "Pending",
  "submittedAt": "2025-08-03T20:48:57.602647Z",
  "petName": "Bella"
}
```

**Application Status Values:**

- `Pending` - Awaiting review
- `Approved` - Application accepted
- `Rejected` - Application declined

## Automatic Adoption Workflow

The API includes automatic pet status management throughout the adoption process:

### Application Submission

- When a user submits an application for a pet with status "Available", the pet status automatically changes to "Pending"
- Users cannot submit multiple applications for the same pet

### Application Approval

- When an application is approved, the pet status automatically changes to "Adopted"
- All other pending applications for the same pet are automatically rejected
- This ensures only one adoption can be completed per pet

### Application Rejection/Deletion

- If an approved application is later rejected or deleted, the system checks for other approved applications
- If no other approved applications exist, the pet status reverts to "Available"
- If the last pending application is deleted and no applications remain, the pet status reverts to "Available"

### Status Flow

```
Available → Pending (when first application submitted)
Pending → Adopted (when application approved)
Adopted → Available (when approved application rejected/deleted and no other approved apps exist)
```

## Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Error message description",
  "timestamp": "2025-08-03T21:00:00.000Z"
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
- **Content Type**: `multipart/form-data`
- **Request Body** (form data):
  ```
  name: "Fluffy" (required)
  type: "Cat" (required)
  ageGroup: "Adult" (required)
  breed: "Persian" (optional)
  gender: "Female" (optional)
  status: "Available" (optional, defaults to "Available")
  description: "Friendly and playful cat" (optional)
  imageFile: [image file] (optional - jpg, jpeg, png, gif, webp, max 5MB)
  shelterId: 1 (required)
  ```
- **Note**: Shelter staff can only create pets for their own shelter
- **Image Storage**: Images are stored in `/wwwroot/images/` and accessible via `/images/{filename}`

---

#### `/pets/{id}` — `PUT`

- **Description**: Update an existing pet
- **Auth Required**: Yes (ShelterStaff or Admin)
- **Content Type**: `multipart/form-data`
- **Request Body** (form data):
  ```
  name: "Fluffy Updated" (required)
  type: "Cat" (required)
  ageGroup: "Senior" (required)
  breed: "Persian" (optional)
  gender: "Female" (optional)
  status: "Available" (optional)
  description: "Updated description" (optional)
  imageFile: [image file] (optional - replaces existing image)
  ```
- **Note**:
  - Shelter staff can only update pets from their own shelter
  - If a new image is uploaded, the old image is automatically deleted
  - Images are validated for type and size (max 5MB)

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

#### `/applications/my-applications` — `GET`

- **Description**: Get all applications submitted by the current user
- **Auth Required**: Yes (any authenticated user)
- **Response**: Array of the user's own applications, ordered by submission date (newest first)
- **Example Response**:
  ```json
  [
    {
      "id": 4,
      "petId": 2,
      "userId": 2,
      "message": "I'm an experienced adopter.",
      "status": "Pending",
      "submittedAt": "2025-07-31T17:09:04.000Z",
      "petName": "Whiskers"
    },
    {
      "id": 1,
      "petId": 1,
      "userId": 2,
      "message": "I love dogs and have experience adopting.",
      "status": "Approved",
      "submittedAt": "2025-07-31T05:02:37.000Z",
      "petName": "Max"
    }
  ]
  ```

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
    "location": "123 Pet Street, City, State",
    "phone": "555-123-4567",
    "email": "contact@shelter.com",
    "description": "We specialize in rescuing and rehoming cats and dogs",
    "logo": "shelter-logo.png"
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
    "location": "456 New Address, City, State",
    "phone": "555-987-6543",
    "email": "updated@shelter.com",
    "description": "Updated shelter description with new programs",
    "logo": "new-logo.png"
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
  "breed": "Persian",
  "gender": "Female",
  "status": "Available",
  "description": "Friendly cat",
  "imageFileName": "fluffy.jpg",
  "imageUrl": "/images/fluffy.jpg",
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
  "phone": "555-123-4567",
  "email": "contact@shelter.com",
  "description": "We specialize in rescuing and rehoming cats and dogs",
  "logo": "shelter-logo.png",
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
