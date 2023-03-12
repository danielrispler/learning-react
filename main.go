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
	Userid    int `json:"userid" binding:"required"`
	Recieptid int `json:"recieptid" binding:"required"`
	Itemid    int `json:"itemid" binding:"required"`
	Incart    int `json:"incart" binding:"required"`
}

type Reciept_Session struct {
	Userid     int       `json:"userid" binding:"required"`
	Recieptid  int       `json:"recieptid" binding:"required"`
	TotalPrice int       `json:"totalprice" binding:"required"`
	Date       time.Time `json:"date" binding:"required"`
}

type InCart struct {
	ID     int `json:"id" binding:"required"`
	Userid int `json:"userid" binding:"required"`
	Itemid int `json:"itemid" binding:"required"`
	Incart int `json:"incart" binding:"required"`
}

type Str struct {
	Str string `json:"name" binding:"required"`
}

const key = "secretKey"

var active_user_id = -1
var active_user_name = ""

var client *mongo.Client
var itemsCollection *mongo.Collection
var usersCollection *mongo.Collection
var cartsCollection *mongo.Collection
var recieptItemsCollection *mongo.Collection
var recieptSessionsCollection *mongo.Collection

func main() {
	var err error
	client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	itemsCollection = client.Database("testing").Collection("items")
	usersCollection = client.Database("testing").Collection("users")
	cartsCollection = client.Database("testing").Collection("cart_item")
	recieptItemsCollection = client.Database("testing").Collection("reciepts_items")
	recieptSessionsCollection = client.Database("testing").Collection("reciepts_sessions")

	if err != nil {
		fmt.Println("Unable to connect to MongoDB server")
	}

	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	router.Use(static.Serve("/", static.LocalFile("./public", true)))

	// Setup route group for the API

	router.GET("/", func(c *gin.Context) {

		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "*")
		c.Header("Access-Control-Allow-Headers", "*")
		c.JSON(http.StatusOK, gin.H{
			"//message": "pong",
		})
	})

	router.GET("/nonDeleteitems", GetNonDeleteItems)
	router.GET("/allItems", GetAllItems)
	router.GET("/cart", GetCart)
	router.GET("/usersIds", GetUsersIds)
	router.GET("/reciepts/:userID", GetRecieptsSessions)
	router.GET("/recieptsItems/:itemID", GetRecieptsItems)
	router.POST("/login", LoginHandler)

	//call from Reciept
	router.POST("/pay", PayHandler)

	//call from item and ItemAdmin
	router.POST("/cart/add/:itemID", AddItemCart)

	//call from itemReciept
	router.POST("/cart/modifyOneItemCart/:itemID", modifyOneItemCart)

	router.POST("/cart/RemoveProductCompletely/:itemID", RemoveProductCompletely)

	router.POST("/addItem", AddItemToDataBase)
	router.POST("/items/removeItem/:itemID", RemoveItemFromDataBase)

	router.POST("/items/changePrice/:itemID", ChangePrice)

	router.POST("/readCookie", ReadCookie)
	router.POST("/deleteCookie", DeleteCookie)

	router.POST("/items/modifystock/:itemID", modifyStock)

	// Start and run the server
	router.Run(":8080")
}

func ChangePrice(c *gin.Context) {
	bodyPrice, _ := ioutil.ReadAll(c.Request.Body)
	if itemid, err := strconv.Atoi(c.Param("itemID")); err == nil {
		re := regexp.MustCompile("[0-9]+")
		var match = re.FindAllString(string(bodyPrice), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			fmt.Printf("error %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}
		filter := bson.D{{Key: "itemid", Value: itemid}}
		update := bson.D{{Key: "$set", Value: bson.D{{Key: "price", Value: intVar}}}}

		result, err := itemsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		fmt.Println(result)

		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		var results []bson.M

		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {

		c.AbortWithStatus(http.StatusNotFound)
	}
}

func RemoveItemFromDataBase(c *gin.Context) {
	if itemid, err := strconv.Atoi(c.Param("itemID")); err == nil {
		update := bson.D{{Key: "$set", Value: bson.D{{Key: "isDeleted", Value: 1}}}}
		result, err := itemsCollection.UpdateOne(context.TODO(), bson.D{{Key: "itemid", Value: itemid}}, update)

		filterItem := bson.D{{Key: "itemid", Value: itemid}}

		resultDelete, err := cartsCollection.DeleteMany(context.TODO(), filterItem)
		fmt.Println(resultDelete)

		fmt.Println(result)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}

		c.JSON(http.StatusOK, "")
	} else {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}

}

func GetNonDeleteItems(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	cursor, err := itemsCollection.Find(context.TODO(), bson.D{{Key: "isDeleted", Value: 0}})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetUsersIds(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	opts := options.Find().SetProjection(bson.D{{Key: "_id", Value: 0}, {Key: "userid", Value: 1}, {Key: "name", Value: 1}})

	cursor, err := usersCollection.Find(context.TODO(), bson.D{}, opts)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetAllItems(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetRecieptsItems(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	itemid, err := strconv.Atoi(c.Param("itemID"))

	cursor, err := recieptItemsCollection.Find(context.TODO(), bson.D{{Key: "userid", Value: int32(active_user_id)}, {Key: "recieptid", Value: int32(itemid)}})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetRecieptsSessions(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")
	var id int
	if itemid, err := strconv.Atoi(c.Param("userID")); err == nil {
		if itemid == 0 {
			id = active_user_id
		} else {
			id = itemid
		}

	}
	cursor, err := recieptSessionsCollection.Find(context.TODO(), bson.D{{Key: "userid", Value: int32(id)}})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func GetCart(c *gin.Context) {
	(c.Writer).Header().Set("Access-Control-Allow-Origin", "*")

	filterUser := bson.D{{Key: "userid", Value: int32(active_user_id)}}

	cursor, err := cartsCollection.Find(context.TODO(), filterUser)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	var results []bson.M

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}

	c.JSON(http.StatusOK, results)

}

func  ReadCookie(c *gin.Context) {
	cookie, err := c.Cookie("token")
	if err != nil {
		c.JSON(http.StatusOK, "false")
	} else {
		token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(key), nil
		})

		if err != nil {
			c.JSON(http.StatusOK, "false")
		}

		claims := token.Claims.(*jwt.StandardClaims)

		splitted := strings.Split(claims.Issuer, ":")
		active_user_name = splitted[0]
		active_user_id, err = strconv.Atoi(splitted[2])

		c.JSON(http.StatusOK, claims.Issuer)
	}

}

func DeleteCookie(c *gin.Context) {
	c.SetCookie("token", "", -3600, "/", "localhost", false, true)
	c.JSON(http.StatusOK, "")

}

func AddItemToDataBase(c *gin.Context) {
	file, err := c.FormFile("image")

	if err != nil {
		fmt.Println("image upload error --> ", err)
		c.JSON(http.StatusOK, "Server error")

	}
	name := c.Query("name")
	price, err := strconv.Atoi(c.Query("price"))

	opts := options.FindOne().SetSort(bson.D{{Key: "itemid", Value: -1}}).SetProjection(bson.D{{Key: "_id", Value: 1}})
	var result bson.M

	err1 := itemsCollection.FindOne(context.TODO(), bson.D{}, opts).Decode(&result)
	if err1 != nil {
		fmt.Printf("error %s", err1)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err1})
	}
	var temp = result["_id"].(int32)
	var intId = int(temp)
	intId += 1

	var item = bson.D{{Key: "_id", Value: intId}, {Key: "item", Value: name}, {Key: "price", Value: price}, {Key: "imgNumber", Value: intId - 1}, {Key: "left", Value: 10}, {Key: "itemid", Value: intId}, {Key: "isDeleted", Value: 0}}
	intId -= 1

	// Upload the file to specific dst.
	image := fmt.Sprintf("%s.%s", strconv.Itoa(intId), "jpg")

	err = c.SaveUploadedFile(file, fmt.Sprintf("./src/images/%s", image))

	if err != nil {
		fmt.Println("image save error --> ", err)
		c.JSON(http.StatusInternalServerError, "Server error")
	}

	itemsCollection.InsertOne(context.TODO(), item)
	c.JSON(http.StatusOK, 0)

}

func LoginHandler(c *gin.Context) {
	var tuser User
	decoder := json.NewDecoder(c.Request.Body)
	err := decoder.Decode(&tuser)
	if err != nil {
		fmt.Printf("error %s", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	}
	var result bson.M

	opts := options.FindOne().SetProjection(bson.D{{Key: "permission", Value: 1}, {Key: "_id", Value: 1}})
	filter := bson.D{{Key: "name", Value: tuser.Name}, {Key: "password", Value: tuser.Password}}

	 _ = usersCollection.FindOne(context.TODO(), filter, opts).Decode(&result)

	

	var flag int = 0
	if result == nil {
		flag = 0
	} else {
		flag = int(result["permission"].(int32))
	}
	if flag != 0 {
		claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
			Issuer:    tuser.Name + ":" + strconv.Itoa(int(flag)) + ":" + result["_id"].(string),
			ExpiresAt: time.Now().Add(time.Hour * 24).Unix(), //1 day
		})

		token, err := claims.SignedString([]byte(key))

		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}

		c.SetCookie("token", token, 3600, "/", "localhost", false, true)
	}

	c.JSON(http.StatusOK, flag)

}

func PayHandler(c *gin.Context) {
	var counter_recieptid_bson bson.M
	var counter_recieptid int
	filterUser := bson.D{{Key: "userid", Value: int32(active_user_id)}}
	err := usersCollection.FindOne(context.TODO(), filterUser).Decode(&counter_recieptid_bson)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	counter_recieptid = int(counter_recieptid_bson["recieptcounter"].(int32))
	update := bson.D{{Key: "$inc", Value: bson.D{{Key: "recieptcounter", Value: 1}}}}
	outcome, err := usersCollection.UpdateOne(context.TODO(), filterUser, update)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	fmt.Println("OUTCOME", outcome)
	filterItem := bson.D{{Key: "userid", Value: int32(active_user_id)}}
	cursor, err := cartsCollection.Find(context.TODO(), filterItem)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	var results []InCart

	if err = cursor.All(context.TODO(), &results); err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
	}
	var totalprice = 0
	var item_fromitems bson.M
	var item_price int
	for _, result := range results {
		filterItem := bson.D{{Key: "itemid", Value: result.Itemid}}
		err := itemsCollection.FindOne(context.TODO(), filterItem).Decode(&item_fromitems)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		item_price = int(item_fromitems["price"].(int32))
		totalprice += result.Incart * item_price
		newRecieptItem := Reciept_Item{Userid: active_user_id, Recieptid: counter_recieptid, Itemid: result.Itemid, Incart: result.Incart}
		resultInsert, err := recieptItemsCollection.InsertOne(context.TODO(), newRecieptItem)
		fmt.Println(resultInsert, err)
	}
	newRecieptSession := Reciept_Session{Userid: active_user_id, Recieptid: counter_recieptid, TotalPrice: totalprice, Date: time.Now()}
	resultInsert, err := recieptSessionsCollection.InsertOne(context.TODO(), newRecieptSession)
	fmt.Println(resultInsert, err)
	resultDelete, err := cartsCollection.DeleteMany(context.TODO(), filterItem)
	fmt.Println(resultDelete)

	c.JSON(http.StatusOK, results)
}

func AddItemCart(c *gin.Context) {
	bodyData, _ := ioutil.ReadAll(c.Request.Body)
	if itemid, err := strconv.Atoi(c.Param("itemID")); err == nil {

		re := regexp.MustCompile("[0-9]+")
		var match = re.FindAllString(string(bodyData), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			fmt.Printf("error %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}

		var result1 bson.M
		filterUser := bson.D{{Key: "userid", Value: int32(active_user_id)}, {Key: "itemid", Value: itemid}}

		err = cartsCollection.FindOne(context.TODO(), filterUser).Decode(&result1)

		if result1 != nil {
			update := bson.D{{Key: "$inc", Value: bson.D{{Key: "inCart", Value: intVar}}}}
			result, err := cartsCollection.UpdateMany(context.TODO(), filterUser, update)
			fmt.Println(result, err)

		} else {
			newItem := bson.D{{Key: "userid", Value: int32(active_user_id)}, {Key: "itemid", Value: itemid}, {Key: "inCart", Value: intVar}}
			result, err := cartsCollection.InsertOne(context.TODO(), newItem)
			fmt.Println(result, err)
		}

		filterItem := bson.D{{Key: "itemid", Value: itemid}}
		updateLeftField := bson.D{{Key: "$inc", Value: bson.D{{Key: "left", Value: intVar * (-1)}}}}
		result, err := itemsCollection.UpdateMany(context.TODO(), filterItem, updateLeftField)
		fmt.Println(result, err)

		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		var results []bson.M

		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {
		// Item ID is invalid
		c.AbortWithStatus(http.StatusNotFound)
	}
}

func RemoveProductCompletely(c *gin.Context) {
	bodyData, _ := ioutil.ReadAll(c.Request.Body)
	if itemid, err := strconv.Atoi(c.Param("itemID")); err == nil {

		re := regexp.MustCompile("[0-9]+")
		var match = re.FindAllString(string(bodyData), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			fmt.Printf("error %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}

		filterItem := bson.D{{Key: "itemid", Value: int32(itemid)}, {Key: "userid", Value: int32(active_user_id)}}

		resultDelete, err := cartsCollection.DeleteOne(context.TODO(), filterItem)

		filter := bson.D{{Key: "itemid", Value: itemid}}
		update := bson.D{{Key: "$inc", Value: bson.D{{Key: "left", Value: intVar}}}}
		result, err := itemsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		fmt.Println(result, resultDelete)

		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		var results []bson.M

		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {
		// Item ID is invalid
		c.AbortWithStatus(http.StatusNotFound)
	}
}

func modifyOneItemCart(c *gin.Context) {
	var intVarNeg = -1
	x, _ := ioutil.ReadAll(c.Request.Body)
	if itemid, err := strconv.Atoi(c.Param("itemID")); err == nil {
		re := regexp.MustCompile("[0-9]+")
		var match = re.FindAllString(string(x), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			fmt.Printf("error %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}
		if strings.Contains(string(x), "-") {
			intVar = -1
			intVarNeg = 1
		}

		filter := bson.D{{Key: "itemid", Value: itemid}}
		update := bson.D{{Key: "$inc", Value: bson.D{{Key: "left", Value: intVar}}}}
		result, err := itemsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		fmt.Println(result)
		filter = bson.D{{Key: "itemid", Value: itemid}, {Key: "userid", Value: int32(active_user_id)}}
		update = bson.D{{Key: "$inc", Value: bson.D{{Key: "inCart", Value: intVarNeg}}}}
		result, err = cartsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		fmt.Println(result)

		var checkIfZero bson.M

		err1 := cartsCollection.FindOne(context.TODO(), filter).Decode(&checkIfZero)

		if err1 != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}

		if checkIfZero != nil && checkIfZero["inCart"].(int32) == int32(0) {
			resultDelete, err := cartsCollection.DeleteOne(context.TODO(), filter)
			if err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
			}
			fmt.Println(resultDelete)
		}

		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		var results []bson.M

		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {

		c.AbortWithStatus(http.StatusNotFound)
	}
}

func modifyStock(c *gin.Context) {
	x, _ := ioutil.ReadAll(c.Request.Body)
	fmt.Printf("x----- %s", string(x))
	if itemid, err := strconv.Atoi(c.Param("itemID")); err == nil {
		re := regexp.MustCompile("[0-9]+")
		var match = re.FindAllString(string(x), -1)[0]
		intVar, err := strconv.Atoi(match)
		if err != nil {
			fmt.Printf("error %s", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		}
		if strings.Contains(string(x), "-") {
			intVar = intVar * (-1)
		}
		filter := bson.D{{Key: "itemid", Value: itemid}}
		update := bson.D{{Key: "$inc", Value: bson.D{{Key: "left", Value: intVar}}}}
		result, err := itemsCollection.UpdateOne(context.TODO(), filter, update)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		fmt.Println(result)

		cursor, err := itemsCollection.Find(context.TODO(), bson.D{})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}
		var results []bson.M
		if err = cursor.All(context.TODO(), &results); err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"status": false, "message": err.Error()})
		}

		c.JSON(http.StatusOK, results)
	} else {
		c.AbortWithStatus(http.StatusNotFound)
	}
}
