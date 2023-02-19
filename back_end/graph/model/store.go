package model

type Store struct {
	ID         string `json:"id" gorm:"primaryKey"`
	Name       string `json:"name"`
	Image      string `json:"image"`
	Followers  int    `json:"followers"`
	SalesCount int    `json:"salesCount"`
	Policy     string `json:"policy"`
	AboutUs    string `json:"aboutUs"`
}