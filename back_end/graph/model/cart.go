package model

type Cart struct {
	UserID    string   `json:"userID" gorm:"primaryKey"`
	User      *User    `json:"user"`
	ProductID string   `json:"productID"`
	Product   *Product `json:"product"`
	Quantity  int      `json:"quantity"`
	Notes     string   `json:"notes"`
}

type Wishlist struct {
	ID        string `json:"id" gorm:"primaryKey"`
	Name      string `json:"name"`
	UserID    string
	User      *User  `json:"user"`
	Option    string `jsonL:"option"`
	ProductID string
	Product   *Product `json:"product"`
}

type WishlistDetail struct {
	ID         string `json:"id" gorm:"primaryKey"`
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
