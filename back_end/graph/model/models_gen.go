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

type NewAddress struct {
	FirstName   string  `json:"firstName"`
	LastName    string  `json:"lastName"`
	Company     *string `json:"company"`
	Country     string  `json:"country"`
	Phone       string  `json:"phone"`
	Description string  `json:"description"`
	Details     string  `json:"details"`
	City        string  `json:"city"`
	State       string  `json:"state"`
	ZipCode     string  `json:"zipCode"`
	AddressAs   *string `json:"addressAs"`
	IsDefault   bool    `json:"isDefault"`
}

type NewBrand struct {
	Name        string `json:"name"`
	Image       string `json:"image"`
	Description string `json:"description"`
}

type NewCart struct {
	ProductID string `json:"productID"`
	Quantity  int    `json:"quantity"`
	Notes     string `json:"notes"`
}

type NewCategory struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type NewProduct struct {
	Name        string  `json:"name"`
	CategoryID  string  `json:"categoryID"`
	ShopID      string  `json:"shopID"`
	BrandID     string  `json:"brandID"`
	Images      string  `json:"images"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Discount    int     `json:"discount"`
	Stock       int     `json:"stock"`
}

type NewReview struct {
	ProductID   string  `json:"productID"`
	Rating      float64 `json:"rating"`
	Description string  `json:"description"`
}

type NewShop struct {
	Name    string  `json:"name"`
	Image   *string `json:"image"`
	Banner  *string `json:"banner"`
	Policy  *string `json:"policy"`
	AboutUs *string `json:"aboutUs"`
	UserID  string  `json:"userID"`
}

type NewUser struct {
	FirstName string   `json:"firstName"`
	LastName  string   `json:"lastName"`
	Email     string   `json:"email"`
	Password  string   `json:"password"`
	Subscribe bool     `json:"subscribe"`
	Banned    bool     `json:"banned"`
	Role      UserRole `json:"role"`
}

type SearchProduct struct {
	Keyword    *string  `json:"keyword"`
	MinPrice   *float64 `json:"minPrice"`
	MaxPrice   *float64 `json:"maxPrice"`
	OrderBy    *string  `json:"orderBy"`
	CategoryID *string  `json:"categoryID"`
	Discount   *bool    `json:"discount"`
	HighRating *bool    `json:"highRating"`
}

type UserRole string

const (
	UserRoleUser  UserRole = "USER"
	UserRoleAdmin UserRole = "ADMIN"
	UserRoleShop  UserRole = "SHOP"
)

var AllUserRole = []UserRole{
	UserRoleUser,
	UserRoleAdmin,
	UserRoleShop,
}

func (e UserRole) IsValid() bool {
	switch e {
	case UserRoleUser, UserRoleAdmin, UserRoleShop:
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
