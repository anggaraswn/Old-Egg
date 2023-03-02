package model

type Cart struct {
	UserID    string
	User      *User `json:"user"`
	ProductID string
	Product   *Product `json:"product"`
	Quantity  int      `json:"quantity"`
	Notes     string   `json:"notes"`
}

type Wishlist struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	UserID string
	User   *User  `json:"user"`
	Option string `json:"option"`
}

type WishListDetail struct {
	WishlistID string
	Wishlist   *Wishlist `json:"wishlist"`
	ProductID  string
	Product    *Product `json:"product"`
}

type SaveForLater struct {
	ID        string `json:"id" gorm:"primaryKey"`
	UserID    string
	User      *User `json:"user"`
	ProductID string
	Product   *Product `json:"product"`
}
