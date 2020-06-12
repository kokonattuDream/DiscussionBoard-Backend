# DiscussionBoard-Backend

This is a backend service that is built for discussion board (https://github.com/kokonattuDream/DiscussionBoard-UI) 


## API

GET /posts
---
Retrieve All of the posts

#### Response
if success, 
HTTP response code: 200 and
```json
{
    "posts": [
        {
            "replies": [],
            "imageId": "",
            "imageUrl": "",
            "_id": "5ee2c2880342180017339d2e",
            "title": "Family Day!",
            "user": {
                "_id": "5ecb240b9595af4d85977856",
                "username": "adminUser"
            },
            "text": "Any plan for the family day?",
            "create_date": "2020-06-11T23:47:20.020Z",
            "updated_date": "2020-06-11T23:47:20.020Z",
            "category": "Family",
            "region": "Toronto",
            "__v": 0
        },
        {
            "replies": [],
            "imageId": "",
            "imageUrl": "",
            "_id": "5ecb244f9595af4d85977857",
            "title": "How many universities in Ottawa?",
            "user": {
                "_id": "5ecb240b9595af4d85977856",
                "username": "adminUser"
            },
            "text": "How many universities?",
            "create_date": "2020-05-25T01:50:07.082Z",
            "updated_date": "2020-05-25T01:50:07.082Z",
            "category": "Study",
            "region": "Ottawa",
            "__v": 0
        }
    ]
}
```
otherwise,
HTTP response code 500 if internal server error


GET /posts/{id}
---
Retrieve a single post based on the id.
#### requirements
- id: The id of the post you want to get

#### Response
If found,
HTTP response code: 200 and
```json
{
    "post": {
        "replies": [],
        "imageId": "",
        "imageUrl": "",
        "_id": "5ee2c2880342180017339d2e",
        "title": "Family Day!",
        "user": {
            "_id": "5ecb240b9595af4d85977856",
            "username": "adminUser"
        },
        "text": "Any plan for the family day?",
        "create_date": "2020-06-11T23:47:20.020Z",
        "updated_date": "2020-06-11T23:47:20.020Z",
        "category": "Family",
        "region": "Toronto",
        "__v": 0
    }
}
```
otherwise,

HTTP response code 404 if not existed
HTTP response code 500 if internal server error


POST /posts
---
Create a new post

### Request Body

Form Data
- file 
File includes jpg, png, gif files
- data
```json
{
  title: "Beautiful house"
  text: "This is a beautiful house!!!"
  category: "Life"
  region: "Montreal"
  }
```
#### requirements
- title: The title of the post
- text: The content of the post
- category: The category of the post
- region: The region of the post 

#### responses
if success,
HTTP response code: 201
otherwise,
HTTP response code: 500 if internal server error

POST /replies
---
Reply to a post

### Request Body
```json
{
  user: "john"
  reply: "Hello!"
  post: "12432422"
  }
```
#### requirements
- user: Your username 
- reply: The message of the reply
- post: The id of the post

#### responses
if success,
HTTP response code: 201
otherwise,
HTTP response code: 403 if user not log in
HTTP response code: 500 if internal server error

POST /users
---
Register a new user

### Request Body
```json
{
  username: "john"
  password: "wefafaeef"
  confirm_password: "wefafaeef"
  }
```
#### responses
if success,
HTTP response code: 201
otherwise,
HTTP response code: 500 if internal server error

POST /user-session
---
Log in a user

### Request Body
```json
{
  username: "john"
  password: "wefafaeef"
  }
```

#### responses
if success,
HTTP response code: 201
otherwise,
HTTP response code: 500 if internal server error

DELETE /user-session
---
Log out a user

#### responses
if success,
HTTP response code: 204
otherwise,
HTTP response code: 500 if internal server error

