# PayPerks - Credit/Debit Card Offers Management System

PayPerks is a modern web application that helps users manage and claim offers available through their credit and debit cards. The application features a mobile-first design, real-time offer search, and an intuitive user interface.

## Features

### User Management
- User registration and authentication
- Secure password handling
- Session management using localStorage

### Card Management
- Add multiple credit/debit cards to your profile
- Support for various banks and card types
- Card setup wizard after registration

### Offer Management
- Real-time search for available offers
- Filter offers based on merchant names
- View offers specific to your cards
- Claim offers with instant feedback
- View history of claimed offers
- Automatic filtering of previously claimed offers

## Technology Stack

### Frontend
- React.js
- React Router for navigation
- Modern CSS with Flexbox and Grid
- Mobile-first responsive design
- Real-time search with debouncing

### Backend
- Java Spring Boot
- MySQL Database
- JDBC for database connectivity
- RESTful API architecture

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);
```

### Cards Data Table
```sql
CREATE TABLE cards_data (
    card_id INT PRIMARY KEY,
    card_name VARCHAR(100) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    card_type ENUM('credit', 'debit') NOT NULL
);
```

### User Cards Table
```sql
CREATE TABLE cards (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (card_id) REFERENCES cards_data(card_id),
    UNIQUE KEY unique_user_card (user_id, card_id)
);
```

### Offers Data Table
```sql
CREATE TABLE offers_data (
    offer_id INT PRIMARY KEY,
    card_id INT NOT NULL,
    merchant_id INT NOT NULL,
    merchant_name VARCHAR(100) NOT NULL,
    card_name VARCHAR(100) NOT NULL,
    offer_description TEXT NOT NULL,
    FOREIGN KEY (card_id) REFERENCES cards_data(card_id)
);
```

### Claimed Offers Table
```sql
CREATE TABLE claimed_offers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    offer_id INT NOT NULL,
    claimed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (offer_id) REFERENCES offers_data(offer_id),
    UNIQUE KEY unique_user_offer (user_id, offer_id)
);
```

## API Endpoints

### Authentication
- POST `/auth/signup` - Register new user
- POST `/auth/login` - User login

### Cards
- GET `/cards-data` - Get all available cards
- POST `/user-cards` - Add cards to user profile
- GET `/user-cards/{userId}` - Get user's cards

### Offers
- GET `/offers/search` - Search available offers
- GET `/offers/claimed` - Get user's claimed offers
- POST `/offers/claim` - Claim an offer

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Java JDK 11 or higher
- MySQL 8.0 or higher
- Maven

### Database Setup
1. Create MySQL database:
   ```sql
   CREATE DATABASE payperks;
   ```

2. Configure database connection in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/payperks
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. Run the schema creation script:
   ```bash
   mysql -u your_username -p payperks < backend/src/main/resources/schema.sql
   ```

4. Load initial data:
   ```bash
   mysql -u your_username -p payperks < backend/cards_data.sql
   mysql -u your_username -p payperks < backend/offers_data.sql
   ```

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Register a new account or login
2. Complete the card setup process
3. Search for offers using merchant names
4. Claim offers you're interested in
5. View your claimed offers in the "Claimed Offers" tab

## Security Features

- Session management
- CORS configuration
- Input validation
- SQL injection prevention
- Foreign key constraints
- Unique constraints to prevent duplicate claims

## Error Handling

- Form validation
- API error handling
- User feedback messages
- Loading states
- Network error handling
- Database constraint violation handling

## Project Structure

```
PayPerks/
├── frontend/                 # React frontend application
│   ├── public/              # Public assets and index.html
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components (Login, Dashboard, etc.)
│   │   ├── services/       # API integration services
│   │   ├── styles/         # CSS modules and style utilities
│   │   ├── App.js          # Main application component
│   │   └── index.js        # Application entry point
│   ├── package.json        # Frontend dependencies and scripts
│   └── package-lock.json   # Locked versions of dependencies
│
├── backend/                 # Spring Boot backend application
│   ├── src/
│   │   └── main/
│   │       ├── java/com/payperks/
│   │       │   ├── config/         # Configuration classes (CORS, Security)
│   │       │   ├── controller/     # REST API endpoints
│   │       │   ├── service/        # Business logic layer
│   │       │   ├── dao/           # Data Access Objects
│   │       │   ├── model/         # Entity classes
│   │       │   └── PayPerksApplication.java  # Main application class
│   │       └── resources/
│   │           ├── application.properties    # Application configuration
│   │           └── schema.sql               # Database schema
│   ├── pom.xml             # Backend dependencies and build config
│   ├── cards_data.sql      # Initial cards data for database
│   └── new_offers.sql      # Initial offers data for database
│
└── README.md               # Project documentation
```

### Frontend Directory Structure Explanation

- `public/`: Contains static files that are served directly
- `src/components/`: Reusable UI components like buttons, cards, and forms
- `src/pages/`: Individual page components with their specific logic
- `src/services/`: API integration layer for backend communication
- `src/styles/`: CSS files for styling components and pages
- `src/App.js`: Main component that handles routing and layout
- `src/index.js`: Entry point that renders the React application

### Backend Directory Structure Explanation

- `config/`: Configuration classes for:
  - CORS settings
  - Security configuration
  - Database configuration
  - Other application-wide settings

- `controller/`: REST API endpoints that:
  - Handle HTTP requests
  - Validate input
  - Delegate to services
  - Return appropriate responses

- `service/`: Business logic layer that:
  - Implements core functionality
  - Handles transactions
  - Coordinates between controllers and DAOs
  - Implements validation rules

- `dao/`: Data Access Objects that:
  - Handle database operations
  - Implement CRUD operations
  - Map database results to entities

- `model/`: Entity classes that:
  - Define data structure
  - Map to database tables
  - Include validation annotations

### Database Files

- `cards_data.sql`: Contains initial seed data for available credit/debit cards
- `new_offers.sql`: Contains seed data for card offers
- `schema.sql`: Defines the database schema with all tables and relationships

### Configuration Files

- `application.properties`: Contains:
  - Database connection settings
  - Server configuration
  - Logging settings
  - Other application properties

- `pom.xml`: Maven configuration file that:
  - Defines project dependencies
  - Configures build process
  - Sets up plugins and build lifecycle

This structure follows standard practices for full-stack applications, separating concerns between frontend and backend while maintaining a clear and organized codebase.

## Future Enhancements

- Email verification
- Password reset functionality
- OAuth integration
- Push notifications for new offers
- Offer categories and filtering
- Offer recommendations
- Analytics dashboard
- Export claimed offers history
