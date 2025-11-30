package testutil

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	jwtLib "github.com/golang-jwt/jwt/v5"
	"github.com/ledufranco/recruitment-system/pkg/jwt"
	"github.com/stretchr/testify/require"
)
func SetupGinTestContext(t *testing.T, method, path string, body interface{}) (*gin.Context, *httptest.ResponseRecorder) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	var req *http.Request
	if body != nil {
		jsonBody, err := json.Marshal(body)
		require.NoError(t, err)
		req = httptest.NewRequest(method, path, bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
	} else {
		req = httptest.NewRequest(method, path, nil)
	}

	c.Request = req
	return c, w
}
func AddAuthHeader(c *gin.Context, token string) {
	c.Request.Header.Set("Authorization", "Bearer "+token)
}
func GenerateTestToken(user TestUser, secret string, tokenType string, expiration time.Duration) (string, error) {
	claims := &jwt.Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		Type:   tokenType,
		RegisteredClaims: jwtLib.RegisteredClaims{
			ExpiresAt: jwtLib.NewNumericDate(time.Now().Add(expiration)),
			IssuedAt:  jwtLib.NewNumericDate(time.Now()),
			NotBefore: jwtLib.NewNumericDate(time.Now()),
		},
	}

	token := jwtLib.NewWithClaims(jwtLib.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
func ParseResponseBody(t *testing.T, w *httptest.ResponseRecorder, target interface{}) {
	err := json.Unmarshal(w.Body.Bytes(), target)
	require.NoError(t, err)
}
