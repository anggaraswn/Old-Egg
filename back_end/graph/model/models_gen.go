// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
)

type AuthOps struct {
	Login    interface{} `json:"login"`
	Register interface{} `json:"register"`
}

type NewCategory struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type NewProduct struct {
	Name        string  `json:"name"`
	CategoryID  string  `json:"categoryID"`
	StoreID     string  `json:"storeID"`
	Image       string  `json:"image"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Discount    int     `json:"discount"`
	Stock       int     `json:"stock"`
	Details     string  `json:"details"`
}

type NewStore struct {
	Name       string `json:"name"`
	Image      string `json:"image"`
	Followers  int    `json:"followers"`
	SalesCount int    `json:"salesCount"`
	Policy     string `json:"policy"`
	AboutUs    string `json:"aboutUs"`
}

type NewUser struct {
	FirstName string   `json:"firstName"`
	LastName  string   `json:"lastName"`
	Email     string   `json:"email"`
	Phone     string   `json:"phone"`
	Password  string   `json:"password"`
	Subscribe bool     `json:"subscribe"`
	Banned    bool     `json:"banned"`
	Role      UserRole `json:"role"`
}

type UserRole string

const (
	UserRoleUser  UserRole = "USER"
	UserRoleAdmin UserRole = "ADMIN"
)

var AllUserRole = []UserRole{
	UserRoleUser,
	UserRoleAdmin,
}

func (e UserRole) IsValid() bool {
	switch e {
	case UserRoleUser, UserRoleAdmin:
		return true
	}
	return false
}

func (e UserRole) String() string {
	return string(e)
}

func (e *UserRole) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = UserRole(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid UserRole", str)
	}
	return nil
}

func (e UserRole) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
