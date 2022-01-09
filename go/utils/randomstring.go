package utils

import (
	"crypto/rand"
	"math/big"
)

func RandomString(n int) string {
	var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")

	s := make([]rune, n)
	for i := range s {
		index, _ := rand.Int(rand.Reader, big.NewInt(int64(len(letters))))
		s[i] = letters[int(index.Int64())]
	}
	return string(s)
}
