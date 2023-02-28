package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"fmt"

	"github.com/anggaraswn/gqlgen-todos/database"
	"github.com/anggaraswn/gqlgen-todos/graph/model"
	"github.com/anggaraswn/gqlgen-todos/service"
	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// Login is the resolver for the login field.
func (r *authOpsResolver) Login(ctx context.Context, obj *model.AuthOps, email string, password string) (interface{}, error) {
	return service.UserLogin(ctx, email, password)
}

// Register is the resolver for the register field.
func (r *authOpsResolver) Register(ctx context.Context, obj *model.AuthOps, input model.NewUser) (interface{}, error) {
	panic(fmt.Errorf("not implemented: Register - register"))
}

// Auth is the resolver for the auth field.
func (r *mutationResolver) Auth(ctx context.Context) (*model.AuthOps, error) {
	return &model.AuthOps{}, nil
}

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.NewUser, phone *string) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: CreateUser - createUser"))

	db := database.GetDB()
	password, err := model.HashPassword(input.Password)

	user := &model.User{
		FirstName: input.FirstName,
		LastName:  input.LastName,
		Email:     input.Email,
		Phone:     *phone,
		Password:  password,
		Subscribe: input.Subscribe,
		Banned:    input.Banned,
		Role:      input.Role,
		ID:        uuid.NewString(),
	}
	// var user *model.User
	// user.ID = input.UserID

	err = db.Create(user).Error

	return user, err
}

// UpdatePhonenumber is the resolver for the updatePhonenumber field.
func (r *mutationResolver) UpdatePhonenumber(ctx context.Context, phone string) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: UpdatePhonenumber - updatePhonenumber"))
	db := database.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, Invalid Token !",
		}
	}

	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	user, _ := service.UserGetByID(ctx, id)

	if user == nil {
		return nil, &gqlerror.Error{
			Message: "Error, UserID isn't valid!",
		}
	}

	user.Phone = phone

	return user, db.Save(user).Error
}

// UpdatePassword is the resolver for the updatePassword field.
func (r *mutationResolver) UpdatePassword(ctx context.Context, currentPassword string, newPassword string) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: UpdatePassword - updatePassword"))
	db := database.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, Invalid Token !",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	user, _ := service.UserGetByID(ctx, userID)

	if user == nil {
		return nil, &gqlerror.Error{
			Message: "Error, UserID isn't valid!",
		}
	}

	if err:= model.ComparePassword(user.Password, currentPassword); err != nil{
		return nil, &gqlerror.Error{
			Message: "Error, Invalid password",
		}
	}else{
		user.Password, _ = model.HashPassword(newPassword);
	}


	return user, db.Save(user).Error
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	return service.UserGetByID(ctx, id)
}

// Protected is the resolver for the protected field.
func (r *queryResolver) Protected(ctx context.Context) (string, error) {
	return "Success", nil
}

// GetCurrentUser is the resolver for the getCurrentUser field.
func (r *queryResolver) GetCurrentUser(ctx context.Context) (*model.User, error) {
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Error, Invalid Token !",
		}
	}
	// fmt.Print("Test",ctx.Value("auth"))
	// id := ctx.Value("auth").(*service.JwtCustomClaim).ID
	id := ctx.Value("auth").(*service.JwtCustomClaim).ID

	// fmt.Print("ID: ", id)

	return service.UserGetByID(ctx, id)
}

// AuthOps returns AuthOpsResolver implementation.
func (r *Resolver) AuthOps() AuthOpsResolver { return &authOpsResolver{r} }

// Mutation returns MutationResolver implementation.
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

type authOpsResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
