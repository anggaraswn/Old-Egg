package model

import "time"

type Review struct {
	ID        	string `json:"id" gorm:"primaryKey"`
	UserID    	string
	User		*User `json:"user"`
	ProductID 	string
	Product   	*Product `json:"product"`
	CreatedAt 	time.Time `json:"createdAt"`
	Rating		int	`json:"rating"`
	Description string `json:"description"`
}