package service

import (
	"context"
	"strings"

	database "github.com/anggaraswn/gqlgen-todos/database"
	"github.com/anggaraswn/gqlgen-todos/graph/model"
	"github.com/google/uuid"
)

func UserCreate(ctx context.Context, input model.NewUser, phone *string) (*model.User, error) {
	db := database.GetDB()

	password, err := model.HashPassword(input.Password)

	if err != nil {
		return nil, err
	}

	user := model.User{
		ID:       uuid.New().String(),
		FirstName: input.FirstName,
		LastName: input.LastName,
		Email:    strings.ToLower(input.Email),
		Password: password,
		Phone:    *phone,
		Banned:   input.Banned,
	}

	if err := db.Model(user).Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByID(ctx context.Context, id string) (*model.User, error) {
	db := database.GetDB()

	var user model.User
	if err := db.Model(user).Where("id LIKE ?", id).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func UserGetByEmail(ctx context.Context, email string) (*model.User, error) {
	db := database.GetDB()

	var user model.User
	if err := db.Model(user).Where("email = ?", email).Take(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
