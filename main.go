package main

import (
	"context"
	"encoding/json"
	"fmt"

	"io/ioutil"
	"net/http"

	"regexp"
	"strconv"

	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Item struct {
	Name  string `json:"name" binding:"required"`
	Price string `json:"price" binding:"required"`
	Image string `json:"image" binding:"required"`
}

type User struct {
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type Reciept_Item struct {
	UserId    int `json:"userId" binding:"required"`
	RecieptId int `json:"recieptId" binding:"required"`
	ItemId    int `json:"itemId" binding:"required"`
	InCart    int `json:"itemsAmount" binding:"required"`
}

type Reciept_Session struct {
	UserId     int       `json:"userId" binding:"required"`
	RecieptId  int       `json:"recieptId" binding:"required"`
	TotalPrice int       `json:"totalPrice" binding:"required"`
	Date       time.Time `json:"date" binding:"required"`
}

type InCart struct {
	ID     int `json:"id" binding:"required"`
	UserId int `json:"userId" binding:"required"`
	ItemId int `json:"itemId" binding:"required"`
	ItemsAmount int `json:"itemsAmount" binding:"required"`
}

const key = "secretKey"

var active_user_id = -1
var active_user_name = ""

var recieptsLastUserId = -1


var client *mongo.Client
var itemsCollection *mongo.Collection
var usersCollection *mongo.Collection
var cartsCollection *mongo.Collection
var recieptItemsCollection *mongo.Collection
var recieptSessionsCollection *mongo.Collection

func main() {
	var clientErr error
	client, clientErr = mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if clientErr != nil {
		fmt.Println("Unable to connect to MongoDB server")
	}
	itemsCollection = client.Database("testing").Collection("items")
	usersCollection = client.Database("testing").Collection("users")
	cartsCollection = client.Database("testing").Collection("cart_item")
	recieptItemsCollection = client.Database("testing").Collection("reciepts_items")
	recieptSessionsCollection = client.Database("testing").Collection("reciepts_sessions")

	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowCredentials = true
	router.Use(cors.New(corsConfig))

	router.Use(static.Serve("/", static.LocalFile("./public", true)))

	// Setup route group for the API

	router.GET("/", func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "*")
		c.Header("Access-Control-Allow-Headers", "*")
		c.Status(http.StatusOK)
	})

	router.POST("/login", LoginHandler)

	// Use the validateMiddleware middleware for all other requests
	router.Use(validateMiddleware)

	// Handle requests to /<path>
	router.GET("/:path", pathHandler)
	router.GET("/:path/:id", pathHandler)

	router.POST("/:path", pathHandler)
	router.POST("/:path/:id", pathHandler)

	router.Run(":8080")
}

func validateMiddleware(c *gin.Context) {
	cookie, cookieError := c.Cookie("token")
	if cookieError != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	token, tokenError := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})
	if tokenError != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	claims := token.Claims.(*jwt.StandardClaims)
	splitted := strings.Split(claims.Issuer, ":")
	if splitted[1] == "0" { 
		c.AbortWithStatus(http.StatusForbidden)
		return
	} 
	if splitted[1] == "1" { 
        c.Set("validationResult", "1")
        return
    } 
    c.Set("validationResult", "2")
    return
	
}

func pathHandler(c *gin.Context) {
	path := c.Param("path")
	validationResult, exists := c.Get("validationResult")
    if !exists {
        c.AbortWithStatus(http.StatusInternalServerError)
    }
	switch path {
	case "cart":
		GetCart(c)
	case "nonDeleteitems":
		GetNonDeleteItems(c)
	case "allItems":
		GetAllItems(c)
	case "users":
		GetUsers(c)
	case "reciepts":
		GetRecieptsSessions(c, c.Param("id"))	
	case "recieptsItems":
		GetRecieptsItems(c, c.Param("id"))
	case "pay":
		PayHandler(c)
	case "cartAdd":
		AddItemCart(c, c.Param("id"))
	case "modifyCartItem": 
		modifyCartItem(c, c.Param("id"))
	case "removeCartItem": 
		RemoveCartItem(c, c.Param("id"))
	case "addItem":
		if validationResult == "2"{
			AddItemToDataBase(c)
		}else {
            c.AbortWithStatus(http.StatusForbidden)
        }
	case "removeItemFromDataBase":
		if validationResult == "2"{
			RemoveItemFromDataBase(c, c.Param("id"))
		}else {
            c.AbortWithStatus(http.StatusForbidden)
        }
	case "changePrice":
		if validationResult == "2"{
			ChangePrice(c, c.Param("id"))
		}else {
            c.AbortWithStatus(http.StatusForbidden)
        }
	case "deleteCookie":
		DeleteCookie(c)
	case "modifystock":
		if validationResult == "2"{
			modifyStock(c, c.Param("id"))
		}else {
            c.AbortWithStatus(http.StatusForbidden)
        }
	default:
		c.Status(http.StatusNotFound)
	}
}

func ChangePrice(c *gin.Context, itemID string) {
	bodyPrice, _ := ioutil.ReadAll(c.Request.Body)
	if itemId, errCast := strconv.Atoi(itemID); errCast == nil {
		re := regexp.MustCompile("[0-9]+")
		match := re.FindAllString(string(bodyPrice), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err})
		}
		filter := bson.D{{Key: "_id", Value: itemId}}
		update := bson.D{{Key: "$set", Value: bson.D{{Key: "price", Value: intVar}}}}

		_, err = itemsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		var results []bson.M

		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {
		c.AbortWithStatus(http.StatusNotFound)
	}
}

func RemoveItemFromDataBase(c *gin.Context,itemID string) {
	if itemId, err := strconv.Atoi(itemID); err == nil {
		update := bson.D{{Key: "$set", Value: bson.D{{Key: "isDeleted", Value: 1}}}}
		_, err = itemsCollection.UpdateOne(context.TODO(), bson.D{{Key: "_id", Value: itemId}}, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		filterItem := bson.D{{Key: "_id", Value: itemId}}

		_, err = cartsCollection.DeleteMany(context.TODO(), filterItem)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		c.Status(http.StatusOK)
	} else {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"message": err.Error()})
	}

}

func GetNonDeleteItems(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	cursor, err := itemsCollection.Find(context.TODO(), bson.D{{Key: "isDeleted", Value: 0}})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetUsers(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	opts := options.Find().SetProjection(bson.D{{Key: "_id", Value: 1}, {Key: "name", Value: 1}})

	cursor, err := usersCollection.Find(context.TODO(), bson.D{}, opts)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetAllItems(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetRecieptsItems(c *gin.Context, itemID string) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	itemId, err := strconv.Atoi(itemID)

	cursor, err := recieptItemsCollection.Find(context.TODO(), bson.D{{Key: "userId", Value: int32(recieptsLastUserId)}, {Key: "recieptId", Value: int32(itemId)}})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetRecieptsSessions(c *gin.Context, userID string ) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")
	var id int
	if intId, err := strconv.Atoi(userID); err == nil {
		if intId == 0 {
			id = active_user_id
		} else {
			id = intId
			recieptsLastUserId = id
		}
	}
	cursor, err := recieptSessionsCollection.Find(context.TODO(), bson.D{{Key: "userId", Value: int32(id)}})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetCart(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	filterUser := bson.D{{Key: "userId", Value: int32(active_user_id)}}

	cursor, err := cartsCollection.Find(context.TODO(), filterUser)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func DeleteCookie(c *gin.Context) {
	c.SetCookie("token", "", -3600, "/", "localhost", false, true)
	c.Status(http.StatusOK)
}

func AddItemToDataBase(c *gin.Context) {
	file, err := c.FormFile("image")

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"error": err})
	}
	name := c.Query("name")
	price, err := strconv.Atoi(c.Query("price"))

	opts := options.FindOne().SetSort(bson.D{{Key: "_id", Value: -1}}).SetProjection(bson.D{{Key: "_id", Value: 1}})
	var result bson.M

	err1 := itemsCollection.FindOne(context.TODO(), bson.D{}, opts).Decode(&result)
	if err1 != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"error": err1})
	}
	var temp = result["_id"].(int32)
	var intId = int(temp)
	intId += 1
	

	var item = bson.D{{Key: "_id", Value: intId}, {Key: "name", Value: name}, {Key: "price", Value: price}, {Key: "imageName", Value: intId-1}, {Key: "stockAmount", Value: 10}, {Key: "isDeleted", Value: 0}}
	
	image := fmt.Sprintf("%s.%s", strconv.Itoa(intId-1), "jpg")
	// Upload the file to specific dst.
	

	err = c.SaveUploadedFile(file, fmt.Sprintf("./src/images/%s", image))

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"error": err1})
	}

	itemsCollection.InsertOne(context.TODO(), item)
	c.JSON(http.StatusOK, 0)

}

func LoginHandler(c *gin.Context) {
	var tuser User
	decoder := json.NewDecoder(c.Request.Body)
	err := decoder.Decode(&tuser)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err})
	}
	var result bson.M

	opts := options.FindOne().SetProjection(bson.D{{Key: "permission", Value: 1}, {Key: "_id", Value: 1}})
	filter := bson.D{{Key: "name", Value: tuser.Name}, {Key: "password", Value: tuser.Password}}

	_ = usersCollection.FindOne(context.TODO(), filter, opts).Decode(&result)

	permission := 0
	if result != nil {
		permission = int(result["permission"].(int32))
		claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
			Issuer:    tuser.Name + ":" + strconv.Itoa(permission) + ":" + result["_id"].(string),
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), //1 day
		})

		token, err := claims.SignedString([]byte(key))

		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		}

		c.SetCookie("token", token, 3600, "/", "localhost", false, false)
		active_user_name = tuser.Name
		active_user_id, err = strconv.Atoi(result["_id"].(string))
	}

	

	c.JSON(http.StatusOK, permission)

}

func PayHandler(c *gin.Context) {
	var counter_recieptId_bson bson.M
	var counter_recieptId int
	filterUser := bson.D{{Key: "_id", Value: strconv.Itoa(active_user_id)}}
	err := usersCollection.FindOne(context.TODO(), filterUser).Decode(&counter_recieptId_bson)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	counter_recieptId = int(counter_recieptId_bson["recieptCounter"].(int32))
	update := bson.D{{Key: "$inc", Value: bson.D{{Key: "recieptCounter", Value: 1}}}}
	_, err = usersCollection.UpdateOne(context.TODO(), filterUser, update)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	filterItem := bson.D{{Key: "userId", Value: int32(active_user_id)}}
	cursor, err := cartsCollection.Find(context.TODO(), filterItem)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	var results []InCart

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	totalPrice := 0
	var item_fromitems bson.M
	var item_price int
	for _, result := range results {
		filterItem := bson.D{{Key: "_id", Value: result.ItemId}}
		err := itemsCollection.FindOne(context.TODO(), filterItem).Decode(&item_fromitems)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		item_price = int(item_fromitems["price"].(int32))
		totalPrice += result.ItemsAmount * item_price
		newRecieptItem :=bson.D{{Key: "userId", Value: active_user_id}, {Key: "recieptId", Value: counter_recieptId}, {Key: "itemId", Value: result.ItemId}, {Key: "inCart", Value: result.ItemsAmount}}
		_, err = recieptItemsCollection.InsertOne(context.TODO(), newRecieptItem)
	}
	newRecieptSession :=bson.D{{Key: "userId", Value: active_user_id}, {Key: "recieptId", Value: counter_recieptId}, {Key: "totalPrice", Value: totalPrice}, {Key: "date", Value: time.Now()}}
	_, err = recieptSessionsCollection.InsertOne(context.TODO(), newRecieptSession)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}
	_, err = cartsCollection.DeleteMany(context.TODO(), filterItem)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
	}

	c.JSON(http.StatusOK, results)
}

func AddItemCart(c *gin.Context, itemID string) {
	bodyData, _ := ioutil.ReadAll(c.Request.Body)
	if itemId, err := strconv.Atoi(itemID); err == nil {
		re := regexp.MustCompile("[0-9]+")
		match := re.FindAllString(string(bodyData), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err})
		}

		var result1 bson.M
		filterUser := bson.D{{Key: "userId", Value: int32(active_user_id)}, {Key: "itemId", Value: itemId}}

		err = cartsCollection.FindOne(context.TODO(), filterUser).Decode(&result1)

		if result1 != nil {
			update := bson.D{{Key: "$inc", Value: bson.D{{Key: "itemsAmount", Value: intVar}}}}
			_, err := cartsCollection.UpdateMany(context.TODO(), filterUser, update)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err})
			}

		} else {
			newItem := bson.D{{Key: "userId", Value: int32(active_user_id)}, {Key: "itemId", Value: itemId}, {Key: "itemsAmount", Value: intVar}}
			_, err := cartsCollection.InsertOne(context.TODO(), newItem)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err})
			}
		}

		filterItem := bson.D{{Key: "_id", Value: itemId}}
		updateLeftField := bson.D{{Key: "$inc", Value: bson.D{{Key: "stockAmount", Value: intVar * (-1)}}}}
		_, err = itemsCollection.UpdateMany(context.TODO(), filterItem, updateLeftField)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err})
		}
		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		var results []bson.M

		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {
		// Item ID is invalid
		c.AbortWithStatus(http.StatusNotFound)
	}
}

func RemoveCartItem(c *gin.Context,itemID string) {
	bodyData, _ := ioutil.ReadAll(c.Request.Body)
	if itemId, err := strconv.Atoi(itemID); err == nil {

		re := regexp.MustCompile("[0-9]+")
		match := re.FindAllString(string(bodyData), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"error": err})
		}

		filterItem := bson.D{{Key: "itemId", Value: int32(itemId)}, {Key: "userId", Value: int32(active_user_id)}}

		_, err = cartsCollection.DeleteOne(context.TODO(), filterItem)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		filter := bson.D{{Key: "_id", Value: itemId}}
		update := bson.D{{Key: "$inc", Value: bson.D{{Key: "stockAmount", Value: intVar}}}}
		_, err = itemsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		var results []bson.M

		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {
		// Item ID is invalid
		c.AbortWithStatus(http.StatusNotFound)
	}
}

func modifyCartItem(c *gin.Context, itemID string) {
	var intVarNeg = -1
	x, _ := ioutil.ReadAll(c.Request.Body)
	if itemId, err := strconv.Atoi(itemID); err == nil {
		re := regexp.MustCompile("[0-9]+")
		match := re.FindAllString(string(x), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"error": err})
		}
		if strings.Contains(string(x), "-") {
			intVar = -1
			intVarNeg = 1
		}

		filter := bson.D{{Key: "_id", Value: itemId}}
		update := bson.D{{Key: "$inc", Value: bson.D{{Key: "stockAmount", Value: intVar}}}}
		_, err = itemsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		filter = bson.D{{Key: "itemId", Value: itemId}, {Key: "userId", Value: int32(active_user_id)}}
		update = bson.D{{Key: "$inc", Value: bson.D{{Key: "itemsAmount", Value: intVarNeg}}}}
		_, err = cartsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		var checkIfZero bson.M

		err = cartsCollection.FindOne(context.TODO(), filter).Decode(&checkIfZero)

		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		if checkIfZero != nil && checkIfZero["itemsAmount"].(int32) == int32(0) {
			_, err := cartsCollection.DeleteOne(context.TODO(), filter)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			}
		}

		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		var results []bson.M

		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {

		c.AbortWithStatus(http.StatusNotFound)
	}
}

func modifyStock(c *gin.Context,itemID string) {
	x, _ := ioutil.ReadAll(c.Request.Body)
	if itemId, err := strconv.Atoi(itemID); err == nil {
		re := regexp.MustCompile("[0-9]+")
		match := re.FindAllString(string(x), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"error": err})
		}
		if strings.Contains(string(x), "-") {
			intVar = intVar * (-1)
		}
		filter := bson.D{{Key: "_id", Value: itemId}}
		update := bson.D{{Key: "$inc", Value: bson.D{{Key: "stockAmount", Value: intVar}}}}
		_, err = itemsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}
		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusBadGateway, gin.H{"message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {
		c.AbortWithStatus(http.StatusNotFound)
	}
}
