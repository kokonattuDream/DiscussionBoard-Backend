const app = require('../../server');
const supertest = require('supertest');
const mongoose = require('mongoose');

describe("Register/Log in Feature", () => {

    it("Sign Up a new user", async() =>{
        let newUserPayload = {
            "username": "test1",
            "password": "12345678"
        };
        
        const response = await supertest(app)
            .post('/users')
            .send(newUserPayload);
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            "message": 'User successfully created', 
            "user": {
                "username": newUserPayload.username
            }
        });
    });

    it("Log in with existed user", async() => {
        let userPayload = {
            "username": "test1",
            "password": "12345678"
        };

        const response = await supertest(app)
            .post('/user-session')
            .send(userPayload);
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            {
                "message": 'User successfully logined', 
                "user": {
                    "username": userPayload.username
                }
            }
        );
    });

    it("Log out", async() => {

        const response = await supertest(app)
            .delete('/user-session');
        
        expect(response.statusCode).toBe(204);
    });

    it("Log in with wrong password", async() => {
        let userPayload = {
            "username": "test1",
            "password": "999999999"
        };

        const response = await supertest(app)
            .post('/user-session')
            .send(userPayload);
        
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(
            {
                "error": 'Password is incorrect', 
            }
        );
    });

    it("Log in with non-existed user", async() => {
        let userPayload = {
            "username": "test2",
            "password": "999999999"
        };

        const response = await supertest(app)
            .post('/user-session')
            .send(userPayload);
        
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual(
            {
                "error": 'Username not found', 
            }
        );
    });
});

describe("Get Posts", () =>{
    it("Get All Posts: no posts", async() => {
        const response = await supertest(app).get('/posts');
        expect(response.body).toEqual({"posts": []});
        expect(response.statusCode).toBe(200);
    });
});

afterAll(() =>{
    mongoose.connection.collection("users").drop();
    mongoose.connection.close();
    app.close();
});