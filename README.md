# Assignment 02 - NodeJS Master class

Start the app:

> __node index.js__




1. Creating a user on the app

__POST__ request to __localhost:{port}/users__

__Payload:__
```json
{
	"firstName" : "xxxx",
	"lastName" : "yyyy",
	"email" : "xyz@abcd.com",
	"password" : "password",
	"tosAgreement" : true
}
```

Returns:
* 200 - If User creation success
* 400 - Bad Request (Description for the error will be return)


2. Create a token for the user (LOGIN)

__POST__ request to __localhost:3000/tokens__

__Payload:__
```json
{
	"email" : "xyz@abcd.com",
	"password" : "password"
}
```

Returns:
* 200 - 
```json
{
    "email": "xyz@abcd.com",
    "id": "famh3cujeaewlw60z1ti3uqk8iimf6rlmod3viv538eowvu8vejcnnv9y0sdsymc",
    "expires": 1549270887170
}
```
__NOTE:__
Your token for future requests will be
```
famh3cujeaewlw60z1ti3uqk8iimf6rlmod3viv538eowvu8vejcnnv9y0sdsymc
```


3. Get the PIZZA Menu

__GET__ request to __localhost:3000/pizza__

__Query string:__
* email: xyz@abcd.com

__Headers:__
* token: <your token from the 2nd step>

Returns:
* 200 - 
```json
[
    {
        "id": 1,
        "name": "Devilled Chicken",
        "price": 15
    },
    {
        "id": 2,
        "name": "Cheese Lovers",
        "price": 14
    },
    {
        "id": 3,
        "name": "Hot Garlic Prawns",
        "price": 19
    },
    {
        "id": 4,
        "name": "Devilled Beef",
        "price": 13
    }
]
```
