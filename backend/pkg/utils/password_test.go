package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHashPassword(t *testing.T) {
	t.Run("should generate valid hash for password", func(t *testing.T) {
		password := "testpassword123"
		hash, err := HashPassword(password)

		assert.NoError(t, err)
		assert.NotEmpty(t, hash)
		assert.NotEqual(t, password, hash)
	})

	t.Run("should generate different hashes for same password", func(t *testing.T) {
		password := "samepassword"
		hash1, err1 := HashPassword(password)
		hash2, err2 := HashPassword(password)

		assert.NoError(t, err1)
		assert.NoError(t, err2)
		assert.NotEqual(t, hash1, hash2, "Hashes should be different due to salt")
	})

	t.Run("should handle empty password", func(t *testing.T) {
		hash, err := HashPassword("")
		assert.NoError(t, err)
		assert.NotEmpty(t, hash)
	})
}

func TestCheckPassword(t *testing.T) {
	password := "correctpassword"
	hash, _ := HashPassword(password)

	t.Run("should return true for correct password", func(t *testing.T) {
		result := CheckPassword(password, hash)
		assert.True(t, result)
	})

	t.Run("should return false for incorrect password", func(t *testing.T) {
		result := CheckPassword("wrongpassword", hash)
		assert.False(t, result)
	})

	t.Run("should return false for empty password against hash", func(t *testing.T) {
		result := CheckPassword("", hash)
		assert.False(t, result)
	})

	t.Run("should return false for invalid hash", func(t *testing.T) {
		result := CheckPassword(password, "invalid-hash")
		assert.False(t, result)
	})
}
