package model

type Shop struct {
	ID         string `json:"id" gorm:"primaryKey"`
	Name       string `json:"name"`
	Image      string `json:"image"`
	Banner     string `json:"banner"`
	Followers  int    `json:"followers"`
	SalesCount int    `json:"salesCount"`
	Policy     string `json:"policy"`
	AboutUs    string `json:"aboutUs"`
	Banned     bool   `json:"banned"`
	UserID     string
	User       *User `json:"user"`
}