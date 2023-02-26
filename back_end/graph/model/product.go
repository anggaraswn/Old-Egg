package model

type Product struct {
	ID              string  `json:"id" gorm:"primaryKey"`
	Name            string  `json:"name"`
	Images          string  `json:"images"`
	Price           float64 `json:"price"`
	Discount        int     `json:"discount"`
	Rating          int     `json:"rating"`
	Stock           int     `json:"stock"`
	Description     string  `json:"description"`
	NumberOfReviews int     `json:"numberOfReviews"`
	NumberBought    int     `json:"numberBought"`
	CategoryID      string
	Category        *Category `json:"category"`
	StoreID         string
	Store           *Store `json:"store"`
	BrandID         string
	Brand           *Brand `json:"brand"`
}

type Category struct {
	ID          string `json:"id" gorm:"primaryKey"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type Brand struct {
	ID          string `json:"id" gorm:"primaryKey"`
	Name        string `json:"name"`
	Image       string `json:"image"`
	Description string `json:"description"`
}