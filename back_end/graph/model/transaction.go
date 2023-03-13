package model

import "time"

type PaymentType struct {
	ID   string `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
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