package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNormalizeText(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "should remove accents",
			input:    "Desenvolvedor Front-End",
			expected: "desenvolvedor front end",
		},
		{
			name:     "should convert to lowercase",
			input:    "DESENVOLVEDOR BACKEND",
			expected: "desenvolvedor backend",
		},
		{
			name:     "should remove special characters",
			input:    "Dev@Ops #Engineer!",
			expected: "dev ops engineer",
		},
		{
			name:     "should handle multiple spaces",
			input:    "Full    Stack    Developer",
			expected: "full stack developer",
		},
		{
			name:     "should handle accented characters",
			input:    "Estágio em Programação",
			expected: "estagio em programacao",
		},
		{
			name:     "should handle mixed case and accents",
			input:    "Técnico em TI",
			expected: "tecnico em ti",
		},
		{
			name:     "should handle empty string",
			input:    "",
			expected: "",
		},
		{
			name:     "should handle only special characters",
			input:    "@#$%",
			expected: "",
		},
		{
			name:     "should preserve numbers",
			input:    "Dev123",
			expected: "dev123",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := NormalizeText(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

