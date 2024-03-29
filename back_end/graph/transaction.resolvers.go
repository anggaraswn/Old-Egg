package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.24

import (
	"context"
	"fmt"
	"time"

	"github.com/anggaraswn/gqlgen-todos/database"
	"github.com/anggaraswn/gqlgen-todos/graph/model"
	"github.com/anggaraswn/gqlgen-todos/service"
	"github.com/google/uuid"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// Checkout is the resolver for the checkout field.
func (r *mutationResolver) Checkout(ctx context.Context, deliveryID string, paymentTypeID string, addressID string) (*model.TransactionHeader, error) {
	// panic(fmt.Errorf("not implemented: Checkout - checkout"))
	db := database.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Invalid Token !",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var carts []*model.Cart
	if err := db.Where("user_id = ?", userID).Find(&carts).Error; err != nil {
		return nil, &gqlerror.Error{
			Message: "Error carts not found",
		}
	}

	println(carts)

	for _, c := range carts {
		product := new(model.Product)
		if err := db.First(product, "id = ?", c.ProductID).Error; err != nil {
			return nil, err
		}

		if c.Quantity > product.Stock {
			return nil, &gqlerror.Error{
				Message: "Error, insufficient product stock ",
			}
		}
	}

	invoice := uuid.NewString()
	transactionHeader := &model.TransactionHeader{
		ID:              uuid.NewString(),
		TransactionDate: time.Now(),
		UserID:          userID,
		AddressID:       addressID,
		PaymentTypeID:   paymentTypeID,
		DeliveryID:      deliveryID,
		Status:          "Open",
		Invoice:         invoice,
	}

	// if err := db.Model(transactionHeader).Create(&transactionHeader); err != nil {
	// 	return transactionHeader, &gqlerror.Error{
	// 		Message: "Error creating transaction header",
	// 	}
	// }

	db.Model(transactionHeader).Create(&transactionHeader)

	for _, c := range carts {
		detail := &model.TransactionDetail{
			TransactionHeaderID: transactionHeader.ID,
			ProductID:           c.ProductID,
			Quantity:            c.Quantity,
		}

		product := new(model.Product)
		if err := db.First(product, "id = ?", c.ProductID).Error; err != nil {
			return nil, err
		}

		// product.Stock -= c.Quantity

		db.Exec("UPDATE products SET stock = stock - ? WHERE id = ?", c.Quantity, c.ProductID)

		// if err := db.Save(product).Error; err != nil {
		// 	return nil, &gqlerror.Error{
		// 		Message: "Error disini",
		// 	}
		// }

		db.Create(detail)

		// db.Delete(c)
		db.Exec("DELETE FROM carts WHERE user_id = ? AND product_id = ?", userID, c.ProductID)
	}

	return transactionHeader, nil
}

// UpdateTransactionHeader is the resolver for the updateTransactionHeader field.
func (r *mutationResolver) UpdateTransactionHeader(ctx context.Context, status string, transactionHeaderID string) (*model.TransactionHeader, error) {
	// panic(fmt.Errorf("not implemented: UpdateTransactionHeader - updateTransactionHeader"))
	db := database.GetDB()

	transactionHeader := new(model.TransactionHeader)

	if err := db.First(transactionHeader, "id = ?", transactionHeaderID).Error; err != nil {
		return nil, err
	}

	transactionHeader.Status = status

	return transactionHeader, db.Save(transactionHeader).Error
}

// CreateVoucher is the resolver for the createVoucher field.
func (r *mutationResolver) CreateVoucher(ctx context.Context, currency float64) (*model.Voucher, error) {
	// panic(fmt.Errorf("not implemented: CreateVoucher - createVoucher"))
	db := database.GetDB()

	voucher := model.Voucher{
		ID:        uuid.NewString(),
		Currency:  currency,
		CreatedAt: time.Now(),
		Valid:     true,
	}

	return &voucher, db.Model(voucher).Create(&voucher).Error
}

// ReedemVoucher is the resolver for the reedemVoucher field.
func (r *mutationResolver) ReedemVoucher(ctx context.Context, voucherID string) (*model.Voucher, error) {
	// panic(fmt.Errorf("not implemented: ReedemVoucher - reedemVoucher"))
	db := database.GetDB()

	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Invalid Token !",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	voucher := new(model.Voucher)

	if err := db.Where("id = ?", voucherID).Find(&voucher).Error; err != nil {
		return nil, &gqlerror.Error{
			Message: "Error, voucher not found",
		}
	}

	if voucher.Valid == false {
		return nil, &gqlerror.Error{
			Message: "Error, invalid voucher",
		}
	}

	voucher.Valid = false

	db.Exec("UPDATE users SET currency = currency + ? WHERE id = ?", voucher.Currency, userID)

	return voucher, db.Save(voucher).Error
}

// TransactionHeaders is the resolver for the transactionHeaders field.
func (r *queryResolver) TransactionHeaders(ctx context.Context) ([]*model.TransactionHeader, error) {
	panic(fmt.Errorf("not implemented: TransactionHeaders - transactionHeaders"))
}

// CurrentUserTransactionHeaders is the resolver for the currentUserTransactionHeaders field.
func (r *queryResolver) CurrentUserTransactionHeaders(ctx context.Context, orderStatus *string, ordersByDay *int, search *string) ([]*model.TransactionHeader, error) {
	// panic(fmt.Errorf("not implemented: CurrentUserTransactionHeaders - currentUserTransactionHeaders"))
	db := database.GetDB()
	if ctx.Value("auth") == nil {
		return nil, &gqlerror.Error{
			Message: "Invalid Token !",
		}
	}

	userID := ctx.Value("auth").(*service.JwtCustomClaim).ID

	var transactionHeaders []*model.TransactionHeader

	t := db.Model(transactionHeaders).Where("user_id = ?", userID)

	if orderStatus != nil && *orderStatus != "all" {
		t = t.Where("status LIKE ?", *orderStatus)
	}

	if ordersByDay != nil && *ordersByDay != -1 {
		date := time.Now().AddDate(0, 0, -*ordersByDay).Format("2006-01-02")
		t = t.Where("transaction_date >= ?", date)
	}

	if search != nil {
		t = t.Where("transaction_headers.id LIKE ? OR invoice LIKE ? OR products.name LIKE ?", "%"+*search+"%", "%"+*search+"%", "%"+*search+"%").
			Joins("JOIN transaction_details ON transaction_headers.id = transaction_details.transaction_header_id").
			Joins("JOIN products ON transaction_details.product_id = products.id")
	}

	return transactionHeaders, t.Find(&transactionHeaders).Error
}

// PaymentTypes is the resolver for the paymentTypes field.
func (r *queryResolver) PaymentTypes(ctx context.Context) ([]*model.PaymentType, error) {
	// panic(fmt.Errorf("not implemented: PaymentTypes - paymentTypes"))
	db := database.GetDB()
	var paymentTypes []*model.PaymentType

	return paymentTypes, db.Find(&paymentTypes).Error
}

// PaymentType is the resolver for the paymentType field.
func (r *queryResolver) PaymentType(ctx context.Context, id string) (*model.PaymentType, error) {
	panic(fmt.Errorf("not implemented: PaymentType - paymentType"))
}

// Deliveries is the resolver for the deliveries field.
func (r *queryResolver) Deliveries(ctx context.Context) ([]*model.Delivery, error) {
	// panic(fmt.Errorf("not implemented: Deliveries - deliveries"))
	db := database.GetDB()
	var deliveries []*model.Delivery

	return deliveries, db.Find(&deliveries).Error
}

// Delivery is the resolver for the delivery field.
func (r *queryResolver) Delivery(ctx context.Context, id string) (*model.Delivery, error) {
	// panic(fmt.Errorf("not implemented: Delivery - delivery"))
	db := database.GetDB()
	delivery := new(model.Delivery)

	return delivery, db.First(delivery, "id = ?", id).Error
}

// TransactionHeader is the resolver for the transactionHeader field.
func (r *transactionDetailResolver) TransactionHeader(ctx context.Context, obj *model.TransactionDetail) (*model.TransactionHeader, error) {
	// panic(fmt.Errorf("not implemented: TransactionHeader - transactionHeader"))
	db := database.GetDB()
	transactionHeader := new(model.TransactionHeader)

	return transactionHeader, db.First(transactionHeader, "id = ?", obj.TransactionHeader.ID).Error
}

// Product is the resolver for the product field.
func (r *transactionDetailResolver) Product(ctx context.Context, obj *model.TransactionDetail) (*model.Product, error) {
	// panic(fmt.Errorf("not implemented: Product - product"))
	db := database.GetDB()
	product := new(model.Product)

	return product, db.First(product, "id = ?", obj.ProductID).Error
}

// User is the resolver for the user field.
func (r *transactionHeaderResolver) User(ctx context.Context, obj *model.TransactionHeader) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: User - user"))
	db := database.GetDB()
	user := new(model.User)

	return user, db.First(user, "id = ?", obj.UserID).Error
}

// Address is the resolver for the address field.
func (r *transactionHeaderResolver) Address(ctx context.Context, obj *model.TransactionHeader) (*model.Address, error) {
	// panic(fmt.Errorf("not implemented: Address - address"))
	db := database.GetDB()
	address := new(model.Address)

	return address, db.First(address, "id = ?", obj.AddressID).Error
}

// TransactionDetails is the resolver for the transactionDetails field.
func (r *transactionHeaderResolver) TransactionDetails(ctx context.Context, obj *model.TransactionHeader) ([]*model.TransactionDetail, error) {
	// panic(fmt.Errorf("not implemented: TransactionDetails - transactionDetails"))
	db := database.GetDB()

	var transactionDetails []*model.TransactionDetail
	return transactionDetails, db.Where("transaction_header_id = ?", obj.ID).Find(&transactionDetails).Error
}

// PaymentType is the resolver for the paymentType field.
func (r *transactionHeaderResolver) PaymentType(ctx context.Context, obj *model.TransactionHeader) (*model.PaymentType, error) {
	// panic(fmt.Errorf("not implemented: PaymentType - paymentType"))
	db := database.GetDB()
	paymentType := new(model.PaymentType)

	return paymentType, db.First(paymentType, "id = ?", obj.PaymentTypeID).Error
}

// Delivery is the resolver for the delivery field.
func (r *transactionHeaderResolver) Delivery(ctx context.Context, obj *model.TransactionHeader) (*model.Delivery, error) {
	// panic(fmt.Errorf("not implemented: Delivery - delivery"))
	db := database.GetDB()
	delivery := new(model.Delivery)

	return delivery, db.First(delivery, "id = ?", obj.DeliveryID).Error
}

// TransactionDetail returns TransactionDetailResolver implementation.
func (r *Resolver) TransactionDetail() TransactionDetailResolver {
	return &transactionDetailResolver{r}
}

// TransactionHeader returns TransactionHeaderResolver implementation.
func (r *Resolver) TransactionHeader() TransactionHeaderResolver {
	return &transactionHeaderResolver{r}
}

type transactionDetailResolver struct{ *Resolver }
type transactionHeaderResolver struct{ *Resolver }
