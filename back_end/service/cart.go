package service

import (
	"context"

	"github.com/anggaraswn/gqlgen-todos/database"
	"github.com/anggaraswn/gqlgen-todos/graph/model"
)

func CartCreate(ctx context.Context, userID string, productID string, quantity int, notes string) (*model.Cart, error) {
	db := database.GetDB()

	cart := &model.Cart{
		UserID:    userID,
		ProductID: productID,
		Quantity:  quantity,
		Notes:     notes,
	}

	if err := db.Model(cart).Create(&cart).Error; err != nil {
		return nil, err
	}

	return cart, nil
}

func CartGetByUserProduct(ctx context.Context, userID string, productID string) (*model.Cart, error) {
	db := database.GetDB()

	var cart model.Cart

	if err := db.Model(cart).Where("user_id = ? AND product_id = ?", userID, productID).Take(&cart).Error; err != nil {
		return nil, err
	}

	return &cart, nil
}

func SaveForLaterGetByUserProduct(ctx context.Context, userID string, productID string) (*model.SaveForLater, error) {
	db := database.GetDB()

	var saveForLater model.SaveForLater

	if err := db.Model(saveForLater).Where("user_id = ? AND product_id = ?", userID, productID).Take(&saveForLater).Error; err != nil {
		return nil, err
	}

	return &saveForLater, nil
}
