package model

import "time"

type Cart struct {
	UserID    string   `json:"userID" gorm:"primaryKey"`
	User      *User    `json:"user" gorm:"foreignKey:UserID"`
	ProductID string   `json:"productID" gorm:"primaryKey"`
	Product   *Product `json:"product" gorm:"foreignKey:ProductID"`
	Quantity  int      `json:"quantity"`
	Notes     string   `json:"notes"`
}

type Wishlist struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	UserID      string
	User        *User  `json:"user"`
	Notes       string `json:"notes"`
	CreatedDate time.Time `json:"createdDate"`
	Option      Option `json:"option"`
}

type Option string

type WishListDetail struct {
	WishlistID string
	Wishlist   *Wishlist `json:"wishlist"`
	ProductID  string
	Product    *Product `json:"product"`
	Quantity   int      `json:"quantity"`
}

type WishlistFollower struct{
	WishlistID 	string
	Wishlist *Wishlist `json:"wishlist"`
	UserID 	string
	User *User `json:"user"`
}

type SaveForLater struct {
	UserID    string
	User      *User `json:"user"`
	ProductID string
	Product   *Product `json:"product"`
	Quantity  int      `json:"quantity"`
}
