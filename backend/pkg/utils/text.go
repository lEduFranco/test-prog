package utils

import (
	"regexp"
	"strings"
	"unicode"

	"golang.org/x/text/runes"
	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
)

func NormalizeText(text string) string {
	text = strings.ToLower(text)

	t := transform.Chain(norm.NFD, runes.Remove(runes.In(unicode.Mn)), norm.NFC)
	result, _, _ := transform.String(t, text)

	reg := regexp.MustCompile(`[^a-z0-9\s]`)
	result = reg.ReplaceAllString(result, " ")

	result = regexp.MustCompile(`\s+`).ReplaceAllString(result, " ")
	
	return strings.TrimSpace(result)
}

