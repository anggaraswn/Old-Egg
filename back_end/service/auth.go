package service

import (
	"context"

	"github.com/anggaraswn/gqlgen-todos/graph/model"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"gorm.io/gorm"
)

func UserRegister(ctx context.Context, input model.NewUser, phone *string) (interface{}, error) {
	// Check Email
	_, err := UserGetByEmail(ctx, input.Email)
	if err == nil {
		// if err != record not found
		if err != gorm.ErrRecordNotFound {
			return nil, err
		}
	}

	createdUser, err := UserCreate(ctx, input, phone)
	if err != nil {
		return nil, err
	}

	token, err := JwtGenerate(ctx, createdUser.ID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"token": token,
	}, nil
}

func UserLogin(ctx context.Context, email string, password string) (interface{}, error) {
	getUser, err := UserGetByEmail(ctx, email)
	if err != nil {
		// if user not found
		if err == gorm.ErrRecordNotFound {
			return nil, &gqlerror.Error{
				Message: "Email not found",
			}
		}

		println("Test")
		return nil, err
	}

	if err := model.ComparePassword(getUser.Password, password); err != nil {
		return nil, err
	}

	// if !model.CheckPasswordHash(password, getUser.Password) {
	// 	return nil, nil
	// }

	token, err := JwtGenerate(ctx, getUser.ID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"token": token,
	}, nil
}
