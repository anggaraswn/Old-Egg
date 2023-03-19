package model

import "time"

type PaymentType struct {
	ID   string `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

type Delivery struct{
	ID string `json:"id" gorm:"primaryKey"`
	Name	string `json:"name"`
	Price float64 `json:"price"`
	Description	string `json:"description"`
}

type TransactionHeader struct {
	ID              string `json:"id" gorm:"primaryKey"`
	TransactionDate time.Time	`json:"transactionDate"`
	UserID	string
	User *User	`json:"user"`
	AddressID string
	Address *Address `json:"address"`
	PaymentTypeID string
	PaymentType *PaymentType `json:"paymentType"`
	DeliveryID 	string
	Delivery	*Delivery `json:"delivery"`
	Status string `json:"status"`
	Invoice string	`json:"invoice"`
}

type TransactionDetail struct{
	TransactionHeaderID string
	TransactionHeader *TransactionHeader `json:"transactionHeader"`
	ProductID string
	Product *Product `json:"product"`
	Quantity int `json:"quantity"`
}

type Voucher struct{
	ID   string `json:"id" gorm:"primaryKey"`
	Currency float64 	`json:"currency"`
	CreatedAt 	time.Time `json:"createdAt"`
	Valid 	bool	`json:"valid"`
}