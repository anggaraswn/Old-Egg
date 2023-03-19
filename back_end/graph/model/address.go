package model

type Address struct {
	ID          string `json:"id" gorm:"primaryKey"`
	UserID      string
	User        *User  `json:"user"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Company     string `json:"company"`
	Country     string `json:"country"`
	Phone       string `json:"phone"`
	Description string `json:"description"`
	Details     string `json:"details"`
	City        string `json:"city"`
	State       string `json:"state"`
	ZipCode     string `json:"zipCode"`
	AddressAs   string `json:"addressAs"`
	IsDefault   bool   `json:"isDefault"`
}