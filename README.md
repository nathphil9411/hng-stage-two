# Organisation Management API

This is an API for managing organisations and their associations with users. It includes functionality to create organisations and associate them with logged-in users, as well as fetch user details with proper access control.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
  - [Create Organisation](#create-organisation)
  - [Get User By ID](#get-user-by-id)
- [Environment Variables](#environment-variables)
- [Error Handling](#error-handling)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/nathphil9411/hng-stage-two.git
   ```

2. Navigate to the project directory:

   ```sh
   cd organisation-management-api
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Set up the environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     DATABASE_URL=your_database_url
     ```

5. Run database migrations:

   ```sh
   npx prisma migrate dev
   ```

6. Start the server:
   ```sh
   npm start
   ```

## Usage

The API provides endpoints for creating organisations and fetching user details. Ensure you have a proper authentication mechanism of your choice in place to set `req.user.userId` for authenticated requests.

## Endpoints

### Create Organisation

- **URL:** `/api/organisations`
- **Method:** `POST`
- **Description:** Creates a new organisation and associates it with the logged-in user.
- **Request Body:**
  ```json
  {
    "name": "Organisation Name",
    "description": "Organisation Description"
  }
  ```
- Response:
  Success: 201 Created

```json
Copy code
{
"status": "success",
"message": "Organisation created and associated with the user successfully",
"data": {
"orgId": "organisation_id",
"name": "Organisation Name",
"description": "Organisation Description"
}
}
```

- Error: 400 Bad Request

```json
Copy code
{
"status": "Bad request",
"message": "Client error",
"statusCode": 400
}
```

## Get User By ID

URL: /api/users/:id
Method: GET
Description: Fetches a user by their ID, if they belong to the same organisation as the logged-in user or are the logged-in user themselves.
Response:
Success: 200 OK

```json
Copy code
{
"status": "success",
"message": "User retrieved successfully",
"data": {
"userId": "user_id",
"firstName": "First Name",
"lastName": "Last Name",
"email": "email@example.com",
"phone": "1234567890"
}
}
```

- Error: 404 Not Found

```json
Copy code
{
"message": "User not found"
}
```

## Environment Variables

DATABASE_URL: URL of the PostgreSQL database.

- Error Handling
  Errors are logged to the console and appropriate HTTP status codes are returned with error messages.
