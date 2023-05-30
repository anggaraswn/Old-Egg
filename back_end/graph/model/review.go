package model

import "time"

type Review struct {
	ID        	string `json:"id" gorm:"primaryKey"`
	UserID    	string
	User		*User `json:"user"`
	ProductID 	string
	Product   	*Product `json:"product"`
	CreatedAt 	time.Time `json:"createdAt"`
	Rating		float64	`json:"rating"`
	Description string `json:"description"`
}

type ShopReview struct{
	ID string	`json:"id" gorm:"primaryKey"`
	ShopID string 
	Shop *Shop `json:"shop"`
	UserID string
	User *User `json:"user"`
	TransactionHeaderID string
	TransactionHeader *TransactionHeader `json:"transactionHeader"`
	Rating float64 `json:"rating"`
	Review string `json:"review"`
	ReviewDetails string `json:"reviewDetails"`
	CreatedAt time.Time `json:"createdAt"`
	DeliveryOnTime bool `json:"deliveryOnTime"`
	ProductAccuracy bool `json:"productAccuracy"`
	ServiceSatisfaction bool `json:"serviceSatisfaction"`
	Helpful bool `json:"helpful"`
}

type WishlistReview struct{
	ID string	`json:"id" gorm:"primaryKey"`
	WishlistID 	string
	Wishlist	*Wishlist `json:"wishlist"`
	UserID	string
	User *User `json:"user"`
	Rating float64 `json:"rating"`
	Review string `json:"review"`
	DetailReview	string `json:"detailReview"`
	Name string	`json:"name"`
}