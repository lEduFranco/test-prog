package repository

import (
	"database/sql"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/google/uuid"
	"github.com/ledufranco/recruitment-system/internal/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func setupMockDB(t *testing.T) (*gorm.DB, sqlmock.Sqlmock, func()) {
	sqlDB, mock, err := sqlmock.New()
	require.NoError(t, err)

	gormDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDB,
	}), &gorm.Config{})
	require.NoError(t, err)

	cleanup := func() {
		sqlDB.Close()
	}

	return gormDB, mock, cleanup
}

func TestUserRepository_Create(t *testing.T) {
	t.Run("should create user successfully", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)
		user := &models.User{
			ID:           uuid.New(),
			Email:        "test@example.com",
			PasswordHash: "hashed_password",
			Role:         models.RoleCandidate,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "users"`)).
			WithArgs(
				user.Email,
				user.PasswordHash,
				user.Role,
				sqlmock.AnyArg(), 
				sqlmock.AnyArg(), 
				sqlmock.AnyArg(), 
				user.ID,
			).
			WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(user.ID))
		mock.ExpectCommit()

		err := repo.Create(user)

		assert.NoError(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("should return error on database failure", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)
		user := &models.User{
			Email:        "test@example.com",
			PasswordHash: "hashed_password",
			Role:         models.RoleCandidate,
		}

		mock.ExpectBegin()
		mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "users"`)).
			WillReturnError(sql.ErrConnDone)
		mock.ExpectRollback()

		err := repo.Create(user)

		assert.Error(t, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUserRepository_FindByEmail(t *testing.T) {
	t.Run("should find user by email", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)
		expectedUser := &models.User{
			ID:           uuid.New(),
			Email:        "test@example.com",
			PasswordHash: "hashed_password",
			Role:         models.RoleAdmin,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}

		rows := sqlmock.NewRows([]string{"id", "email", "password_hash", "role", "created_at", "updated_at", "deleted_at"}).
			AddRow(expectedUser.ID, expectedUser.Email, expectedUser.PasswordHash, expectedUser.Role, expectedUser.CreatedAt, expectedUser.UpdatedAt, nil)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "users" WHERE email = $1 AND "users"."deleted_at" IS NULL ORDER BY "users"."id" LIMIT 1`)).
			WithArgs("test@example.com").
			WillReturnRows(rows)

		user, err := repo.FindByEmail("test@example.com")

		assert.NoError(t, err)
		assert.NotNil(t, user)
		assert.Equal(t, expectedUser.Email, user.Email)
		assert.Equal(t, expectedUser.ID, user.ID)
		assert.Equal(t, expectedUser.Role, user.Role)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("should return error when user not found", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "users" WHERE email = $1`)).
			WithArgs("nonexistent@example.com").
			WillReturnError(gorm.ErrRecordNotFound)

		user, err := repo.FindByEmail("nonexistent@example.com")

		assert.Error(t, err)
		assert.Nil(t, user)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("should return error on database failure", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "users" WHERE email = $1`)).
			WithArgs("test@example.com").
			WillReturnError(sql.ErrConnDone)

		user, err := repo.FindByEmail("test@example.com")

		assert.Error(t, err)
		assert.Nil(t, user)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUserRepository_FindByID(t *testing.T) {
	t.Run("should find user by ID", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)
		userID := uuid.New()
		expectedUser := &models.User{
			ID:           userID,
			Email:        "test@example.com",
			PasswordHash: "hashed_password",
			Role:         models.RoleCandidate,
			CreatedAt:    time.Now(),
			UpdatedAt:    time.Now(),
		}

		rows := sqlmock.NewRows([]string{"id", "email", "password_hash", "role", "created_at", "updated_at", "deleted_at"}).
			AddRow(expectedUser.ID, expectedUser.Email, expectedUser.PasswordHash, expectedUser.Role, expectedUser.CreatedAt, expectedUser.UpdatedAt, nil)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "users" WHERE id = $1 AND "users"."deleted_at" IS NULL ORDER BY "users"."id" LIMIT 1`)).
			WithArgs(userID).
			WillReturnRows(rows)

		user, err := repo.FindByID(userID)

		assert.NoError(t, err)
		assert.NotNil(t, user)
		assert.Equal(t, expectedUser.ID, user.ID)
		assert.Equal(t, expectedUser.Email, user.Email)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("should return error when user not found", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)
		userID := uuid.New()

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "users" WHERE id = $1`)).
			WithArgs(userID).
			WillReturnError(gorm.ErrRecordNotFound)

		user, err := repo.FindByID(userID)

		assert.Error(t, err)
		assert.Nil(t, user)
		assert.Equal(t, gorm.ErrRecordNotFound, err)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}

func TestUserRepository_EmailExists(t *testing.T) {
	t.Run("should return true when email exists", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT count(*) FROM "users" WHERE email = $1 AND "users"."deleted_at" IS NULL`)).
			WithArgs("existing@example.com").
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(1))

		exists, err := repo.EmailExists("existing@example.com")

		assert.NoError(t, err)
		assert.True(t, exists)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("should return false when email does not exist", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT count(*) FROM "users" WHERE email = $1 AND "users"."deleted_at" IS NULL`)).
			WithArgs("nonexistent@example.com").
			WillReturnRows(sqlmock.NewRows([]string{"count"}).AddRow(0))

		exists, err := repo.EmailExists("nonexistent@example.com")

		assert.NoError(t, err)
		assert.False(t, exists)
		assert.NoError(t, mock.ExpectationsWereMet())
	})

	t.Run("should return error on database failure", func(t *testing.T) {
		db, mock, cleanup := setupMockDB(t)
		defer cleanup()

		repo := NewUserRepository(db)

		mock.ExpectQuery(regexp.QuoteMeta(`SELECT count(*) FROM "users" WHERE email = $1`)).
			WithArgs("test@example.com").
			WillReturnError(sql.ErrConnDone)

		exists, err := repo.EmailExists("test@example.com")

		assert.Error(t, err)
		assert.False(t, exists)
		assert.NoError(t, mock.ExpectationsWereMet())
	})
}
