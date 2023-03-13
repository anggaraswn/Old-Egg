package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/mux"
	"github.com/rs/cors"

	database "github.com/anggaraswn/gqlgen-todos/database"
	"github.com/anggaraswn/gqlgen-todos/directives"
	"github.com/anggaraswn/gqlgen-todos/graph"
	"github.com/anggaraswn/gqlgen-todos/graph/model"
	middlewares "github.com/anggaraswn/gqlgen-todos/middleware"
)

const defaultPort = "8080"

func main() {
	// dsn := "host=localhost user=postgres password=admin dbname=tpaweb port=5432 sslmode=disable TimeZone=Asia/Shanghai"

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db := database.GetDB()

	//Migrate table2 dari Model yang ada
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.Shop{})
	db.AutoMigrate(&model.Category{})
	db.AutoMigrate(&model.Brand{})
	db.AutoMigrate(&model.Product{})
	db.AutoMigrate(&model.Review{})
	db.AutoMigrate(&model.Cart{})
	db.AutoMigrate(&model.Wishlist{})
	db.AutoMigrate(&model.WishListDetail{})
	db.AutoMigrate(&model.SaveForLater{})
	

	router := mux.NewRouter()

	router.Use(middlewares.AuthMiddleware)
	router.Use(cors.New(cors.Options{
		AllowedHeaders:   []string{"*"},
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:8080"},
		AllowCredentials: true,
		Debug:            true,
	   }).Handler)

	c := graph.Config{Resolvers: &graph.Resolver{}}
	c.Directives.Auth = directives.Auth

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(c))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
