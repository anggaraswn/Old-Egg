package model

type Product struct {
	ID              string          `json:"id"`
	Name            string          `json:"name"`
	Images          []*ProductImage `json:"images"`
	Price           float64         `json:"price"`
	Discount        int             `json:"discount"`
	Rating          int             `json:"rating"`
	Stock           int             `json:"stock"`
	Description     string          `json:"description"`
	NumberOfReviews int             `json:"numberOfReviews"`
	NumberBought    int             `json:"numberBought"`
	Category        *Category       `json:"category"`
}

type ProductImage struct {
	ID        string   `json:"id"`
	Image     string   `json:"image"`
	ProductID string   `json:"productID"`
	Product   *Product `json:"product"`
}

type Category struct {
	ID      string   `json:"id"`
	Name    string   `json:"name"`
	Product *Product `json:"product"`
}