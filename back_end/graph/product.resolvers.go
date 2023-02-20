package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"fmt"

	"github.com/anggaraswn/gqlgen-todos/database"
	"github.com/anggaraswn/gqlgen-todos/graph/model"
	"github.com/google/uuid"
)

// CreateProduct is the resolver for the createProduct field.
func (r *mutationResolver) CreateProduct(ctx context.Context, input model.NewProduct) (*model.Product, error) {
	// panic(fmt.Errorf("not implemented: CreateProduct - createProduct"))

	db := database.GetDB()
	product := &model.Product{
		ID:              uuid.NewString(),
		Name:            input.Name,
		Images:          input.Image,
		Price:           input.Price,
		Discount:        input.Discount,
		Rating:          0,
		Stock:           input.Stock,
		Description:     input.Description,
		NumberOfReviews: 0,
		NumberBought:    0,
		CategoryID:      input.CategoryID,
		StoreID:         input.StoreID,
	}

	err := db.Create(product).Error

	return product, err
}

// Category is the resolver for the category field.
func (r *productResolver) Category(ctx context.Context, obj *model.Product) (*model.Category, error) {
	panic(fmt.Errorf("not implemented: Category - category"))
}

// Store is the resolver for the store field.
func (r *productResolver) Store(ctx context.Context, obj *model.Product) (*model.Store, error) {
	panic(fmt.Errorf("not implemented: Store - store"))
}

// Product is the resolver for the product field.
func (r *queryResolver) Product(ctx context.Context, id string) (*model.Product, error) {
	// panic(fmt.Errorf("not implemented: Product - product"))
	db := database.GetDB()
	
	product := new(model.Product);

	return product, db.First(product, "id = ?", id).Error
}

// Products is the resolver for the products field.
func (r *queryResolver) Products(ctx context.Context, storeID *string, limit *int, topSold *bool) ([]*model.Product, error) {
	// panic(fmt.Errorf("not implemented: Products - products"))
	db := database.GetDB()

	var models []*model.Product
	
	data := db.Model(models)

	if(limit != nil){
		data = data.Limit(*limit)
	}

	return models, data.Find(&models).Error
}

// Product returns ProductResolver implementation.
func (r *Resolver) Product() ProductResolver { return &productResolver{r} }

type productResolver struct{ *Resolver }
