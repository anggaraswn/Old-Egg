package model

import "golang.org/x/crypto/bcrypt"

type User struct {
	ID       	string   `json:"id" gorm:"primaryKey"`
	FirstName   string   `json:"firstName"`
	LastName	string 	 `json:"lastName"`
	Email    	string   `json:"email"`
	Phone    	string   `json:"phone"`
	Password 	string   `json:"password"`
	Subscribe	bool	 `json:"subscribe"`
	Banned   	bool     `json:"banned"`
	Role    	UserRole `json:"role"`
}

func HashPassword(s string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(s), bcrypt.DefaultCost)
	return string(hashed), err
}

func ComparePassword(hashed string, normal string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(normal))
}

// func CheckPasswordHash(password, hash string) bool {
// 	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
// 	return err == nil
// }
