# Blogedit Backend

## APIs

| Method | Endpoint             | Description                                                                   |
| ------ | -------------------- | ----------------------------------------------------------------------------- |
| POST   | `/api/auth/register` | `{ username, email, password }`, return new user info (without password) |
| POST   | `/api/auth/login`    | `{ email, password }`, return `{ access_token, refresh_token }`    |
| POST   | `/api/auth/refresh`  | `{ refresh_token }`, return new `{ access_token, refresh_token }` |
| GET    | `/api/user`          | get current user info (need to carry `Authorization: Bearer <access_token>` in Header) |

## Testing

### Test Structure

The backend uses a comprehensive testing strategy with test suites for different components:

```
backend/
├── internal/
│   ├── handler/
│   │   ├── handler_test.go      # Auth handler tests (test suite)
│   │   └── ...
│   ├── middleware/
│   │   ├── jwt_test.go          # JWT middleware tests (test suite)
│   │   └── ...
│   ├── router/
│   │   ├── router_test.go       # Router configuration tests (test suite)
│   │   └── ...
│   ├── database/
│   │   ├── database_test.go     # Database connection tests
│   │   └── ...
│   └── testutils/
│       └── testutils.go         # Test utilities and helpers
```

### Test Types

#### 1. Handler Tests (`handler_test.go`)
- **Purpose**: Test business logic and API endpoints
- **Structure**: Uses `AuthTestSuite` with shared state
- **Features**:
  - Tests complete authentication flow (register → login → refresh → get user)
  - Shared test data between tests
  - Database cleanup between tests
  - Real HTTP requests simulation

#### 2. Middleware Tests (`jwt_test.go`)
- **Purpose**: Test JWT authentication middleware
- **Structure**: Uses `JWTMiddlewareTestSuite`
- **Test Cases**:
  - Valid JWT tokens
  - Invalid/expired tokens
  - Missing Authorization headers
  - Invalid header formats
  - Wrong signing methods
  - Missing/invalid claims

#### 3. Router Tests (`router_test.go`)
- **Purpose**: Test route configuration and middleware setup
- **Structure**: Uses `RouterTestSuite`
- **Test Cases**:
  - Route existence verification
  - CORS configuration
  - Authentication middleware application
  - Error handling (404, 405)
  - Content-Type handling

#### 4. Database Tests (`database_test.go`)
- **Purpose**: Test database connection and migration
- **Features**: Database initialization and cleanup

### Running Tests

#### Prerequisites
1. Create a test database named `testdb` with username `test` and password `test`
2. Copy `.env_test_sample` to `.env_test` and configure test database connection
3. Ensure PostgreSQL is running

#### Test Commands

```bash
# Run all tests
go test -v ./...

# Run tests for specific package
go test -v ./internal/handler
go test -v ./internal/middleware
go test -v ./internal/router
go test -v ./internal/database

# Run specific test suite
go test -v ./internal/handler -run TestAuthSuite
go test -v ./internal/middleware -run TestJWTMiddlewareSuite
go test -v ./internal/router -run TestRouterSuite

# Run specific test
go test -v ./internal/handler -run TestAuthSuite/TestLoginSuccess
go test -v ./internal/middleware -run TestJWTMiddlewareSuite/TestValidToken

# Run tests with coverage
go test -v -cover ./...
go test -v -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

### Test Environment Setup

#### 1. Database Configuration
```bash
# Create test database
createdb testdb

# Or using psql
psql -U postgres -c "CREATE DATABASE testdb;"
psql -U postgres -c "CREATE USER test WITH PASSWORD 'test';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE testdb TO test;"
```

#### 2. Environment Variables
Create `.env_test` file:
```env
DATABASE_DSN=host=localhost user=test password=test dbname=testdb port=5432 sslmode=disable TimeZone=UTC
JWT_SECRET=test-secret-key
```

### Test Data Management

- **Setup**: Each test suite initializes its own test data
- **Cleanup**: Database is cleaned between tests to ensure isolation
- **Isolation**: Tests are independent and can run in any order

### Test Coverage

Current test coverage includes:
- ✅ Authentication flow (register, login, refresh, get user)
- ✅ JWT middleware validation
- ✅ Route configuration and CORS
- ✅ Database connection and migration
- ✅ Error handling and edge cases

### Adding New Tests

When adding new functionality, follow these patterns:

#### 1. Handler Tests
```go
func (suite *YourTestSuite) TestNewFeature() {
    // Setup test data
    suite.setupTestData()
    
    // Make request
    req, err := http.NewRequest("POST", "/api/endpoint", bytes.NewBuffer(body))
    suite.NoError(err)
    
    // Assert response
    suite.Equal(http.StatusOK, w.Code)
}
```

#### 2. Middleware Tests
```go
func (suite *MiddlewareTestSuite) TestNewMiddleware() {
    // Test middleware behavior
    req, err := http.NewRequest("GET", "/test", nil)
    suite.NoError(err)
    
    // Assert middleware response
    suite.Equal(expectedStatus, w.Code)
}
```

#### 3. Router Tests
```go
func (suite *RouterTestSuite) TestNewRoute() {
    // Test route existence and behavior
    req, err := http.NewRequest("GET", "/api/new-route", nil)
    suite.NoError(err)
    
    // Assert route response
    suite.NotEqual(http.StatusNotFound, w.Code)
}
```

## API Contract

The API contract is defined in `docs/api/api-contract-v1.md`.

Every time the API contract is updated, please update the `docs/api/api-contract-v1.yaml` file.

## Development Log

**2025-08-20:** 
- Added comprehensive test suite structure
- Implemented JWT middleware tests
- Added router configuration tests
- Improved test isolation and cleanup

**2025-08-04:** 
- Add github.com/stretchr/testify/assert for testing
- Initial test setup for auth handlers
