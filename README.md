# Nodejs APIs for School Management

**Objective:** Implement a set of APIs using Node.js, Express.js framework, and PostgresSQL to manage school data. The system should allow users to add new schools and retrieve a list of schools sorted by proximity to a user-specified location.

## Get Started

1. Clone the repository:

```bash
git clone https://github.com/JagTheFriend/expressjs-project.git
```

2. Install dependencies:

```bash
cd expressjs-project
npm install
```

3. Create a `.env` file in the root directory and add the following variables:

```bash
PORT=3000
NODE_ENV=development
# Connect to Database via connection pooling
DATABASE_URL="postgresql://..."
# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://..."
```

4. Push database schema:

```bash
npm run db:push
```

5. Run the application:

```bash
npm run dev
```

## Available Routes

- Add School API:

  - Endpoint: /addSchool
  - Method: POST
  - Payload: Includes name, address, latitude, and longitude.
  - Functionality:
    - Validates the input data and adds a new school to the schools table.
  - Validation:
    - Ensure all fields are properly validated before insertion (e.g., non-empty, correct data types).

- List Schools API:
  - Endpoint: /listSchools
  - Method: GET
  - Parameters: User's latitude and longitude.
  - Functionality:
    - Fetches all schools from the database, sorts them based on proximity to the user's location, and returns the sorted list.
  - Sorting Mechanism:
    - Calculate and sort by the geographical distance between the user's coordinates and each school's coordinates.

## Testing

If you want to test the APIs, you can use the Postman collection provided in the `postman_collection.json` file.

Note:

- Remember to set the `BASE_URL` variable to `https://expressjs-project-educase.onrender.com` in the Postman collection.
- Otherwise, set to `https://localhost:3000` if locally hosted.
