package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"

	"github.com/anggaraswn/gqlgen-todos/database"
	"github.com/anggaraswn/gqlgen-todos/graph/model"
	"github.com/anggaraswn/gqlgen-todos/service"
	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// CreateShop is the resolver for the createShop field.
func (r *mutationResolver) CreateShop(ctx context.Context, input model.NewShop) (*model.Shop, error) {
	// panic(fmt.Errorf("not implemented: CreateShop - createShop"))
	db := database.GetDB()

	shop := new(model.Shop)
	if err := db.Where("name = ?", input.Name).Take(&shop).Error; err != nil {
		shop = nil
	}

	if shop != nil {
		return nil, &gqlerror.Error{
			Message: "Name already taken!",
		}
	}

	println(*&input.Image)

	if input.Image != nil {
		shop = &model.Shop{
			ID:         uuid.NewString(),
			Name:       input.Name,
			Image:      *input.Image,
			Banner:     *input.Banner,
			Followers:  0,
			SalesCount: 0,
			Policy:     *input.Policy,
			AboutUs:    *input.AboutUs,
			Banned:     false,
			Rating:     0,
			UserID:     input.UserID,
		}
	} else {
		shop = &model.Shop{
			ID:         uuid.NewString(),
			Name:       input.Name,
			Followers:  0,
			SalesCount: 0,
			Banned:     false,
			Rating:     0,
			UserID:     input.UserID,
		}
	}

	return shop, db.Model(shop).Create(&shop).Error
}

// UpdateShop is the resolver for the updateShop field.
func (r *mutationResolver) UpdateShop(ctx context.Context, aboutUs *string, shopName *string, image *string) (*model.Shop, error) {
	// panic(fmt.Errorf("not implemented: UpdateShop - updateShop"))
	db := database.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Invalid Token !",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	shop := new(model.Shop)

	db.First(shop, "user_id = ?", userID)

	if aboutUs != nil {
		shop.AboutUs = *aboutUs
	}

	if shopName != nil {
		shop.Name = *shopName
	}

	if image != nil {
		shop.Image = *image
	}

	return shop, db.Save(shop).Error
}

// UpdateShopBanStatus is the resolver for the updateShopBanStatus field.
func (r *mutationResolver) UpdateShopBanStatus(ctx context.Context, shopID string, banned bool) (*model.Shop, error) {
	// panic(fmt.Errorf("not implemented: UpdateShopBanStatus - updateShopBanStatus"))
	db := database.GetDB()

	shop := new(model.Shop)
	db.First(shop, "id = ?", shopID)

	shop.Banned = banned

	return shop, db.Save(shop).Error
}

// Shops is the resolver for the Shops field.
func (r *queryResolver) Shops(ctx context.Context, limit *int, offset *int, filter *string) ([]*model.Shop, error) {
	// panic(fmt.Errorf("not implemented: Shops - Shops"))
	db := database.GetDB()

	var shops []*model.Shop

	s := db.Model(shops)

	if limit != nil {
		s = s.Limit(*limit)
	}
	if offset != nil {
		s = s.Offset(*offset)
	}

	if filter != nil {
		if *filter == "banned" {
			s = s.Where("banned = TRUE")
		} else if *filter == "unbanned" {
			s = s.Where("banned = FALSE")
		}
	}

	return shops, s.Find(&shops).Error
}

// Shop is the resolver for the Shop field.
func (r *queryResolver) Shop(ctx context.Context, id *string, userID *string) (*model.Shop, error) {
	// panic(fmt.Errorf("not implemented: Shop - Shop"))
	db := database.GetDB()

	shop := new(model.Shop)

	var err error

	if id != nil {
		db.First(shop, "id = ?", *id)
	}

	if userID != nil {
		db.First(shop, "user_id = ?", *userID)
	}

	return shop, err
}

// TopShop is the resolver for the topShop field.
func (r *queryResolver) TopShop(ctx context.Context) ([]*model.Shop, error) {
	// panic(fmt.Errorf("not implemented: TopShop - topShop"))
	db := database.GetDB()

	var shops []*model.Shop

	return shops, db.Model(shops).Select("s.id, s.name, s.image, s.banner, s.followers, s.sales_count, s.policy, s.about_us, s.banned, s.user_id, COUNT(th.id) AS totalTransaction FROM shops AS s JOIN products AS p ON s.id = p.shop_id JOIN transaction_details AS td ON td.product_id = p.id JOIN transaction_headers AS th ON th.id = td.transaction_header_id WHERE s.banned = false GROUP BY s.id ORDER BY totalTransaction DESC ").Limit(3).Find(&shops).Error
}

// ShopProducts is the resolver for the shopProducts field.
func (r *queryResolver) ShopProducts(ctx context.Context, shopID string, sortBy *string, categoryID *string, limit *int, offset *int) ([]*model.Product, error) {
	// panic(fmt.Errorf("not implemented: ShopProducts - shopProducts"))
	db := database.GetDB()

	var products []*model.Product

	p := db.Model(products).Where("shop_id = ?", shopID)

	if sortBy != nil {
		if *sortBy == "topBuyed" {
			p = db.Select("products.id, products.brand_id, products.category_id, products.shop_id, products.name, products.description, products.price, products.images, products.stock, products.discount, SUM(transaction_details.quantity) AS totalQuantitySold").
				Joins("LEFT JOIN transaction_details ON products.id = transaction_details.product_id").
				Where("shop_id = ?", shopID).
				Group("products.id").
				Order("totalQuantitySold DESC")
		} else if *sortBy == "topRating" {
			p = p.Order("rating DESC")
		} else if *sortBy == "lowestPrice" {
			p = p.Order("price ASC")
		} else if *sortBy == "highestPrice" {
			p = p.Order("price DESC")
		}
	}

	if categoryID != nil {
		p = p.Where("category_id = ?", *categoryID)
	}

	if limit != nil {
		p = p.Limit(*limit)
	}

	if offset != nil {
		p = p.Offset(*offset)
	}

	return products, p.Find(&products).Error
}

// ShopOrders is the resolver for the shopOrders field.
func (r *queryResolver) ShopOrders(ctx context.Context, filter *string) ([]*model.TransactionHeader, error) {
	// panic(fmt.Errorf("not implemented: ShopOrders - shopOrders"))
	db := database.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Invalid Token !",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	shop := new(model.Shop)

	db.First(shop, "user_id = ?", userID)

	var shopOrders []*model.TransactionHeader

	s := db.Model(shopOrders).Joins("JOIN transaction_details ON transaction_headers.id = transaction_details.transaction_header_id").
		Joins("JOIN products ON transaction_details.product_id = products.id").Where("products.shop_id = ?", shop.ID)

	if filter != nil && *filter != "all" {
		s = s.Where("transaction_headers.status LIKE ?", *filter)
	}

	return shopOrders, s.Find(&shopOrders).Error
}

// User is the resolver for the user field.
func (r *shopResolver) User(ctx context.Context, obj *model.Shop) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: User - user"))
	db := database.GetDB()

	user := new(model.User)

	return user, db.Where("id = ?", obj.UserID).Take(&user).Error
}

// Products is the resolver for the products field.
func (r *shopResolver) Products(ctx context.Context, obj *model.Shop) ([]*model.Product, error) {
	// panic(fmt.Errorf("not implemented: Products - products"))
	db := database.GetDB()

	var products []*model.Product

	return products, db.Where("shop_id = ?", obj.ID).Find(&products).Error
}

// Shop returns ShopResolver implementation.
func (r *Resolver) Shop() ShopResolver { return &shopResolver{r} }

type shopResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//   - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//     it when you're done.
//   - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *queryResolver) UpdateShop(ctx context.Context, shopID string, aboutUs *string, shopName *string, image *string) (*model.Shop, error) {
	// panic(fmt.Errorf("not implemented: UpdateShop - updateShop"))

	db := database.GetDB()

	shop := new(model.Shop)

	db.First(shop, "id = ?", shopID)

	if aboutUs != nil {
		shop.AboutUs = *aboutUs
	}

	if shopName != nil {
		shop.Name = *shopName
	}

	if image != nil {
		shop.Image = *image
	}

	return shop, db.Save(shop).Error
}
