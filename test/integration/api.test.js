const app = require('../../server');
const supertest = require('supertest');
const mongoose = require('mongoose');

describe("Validate ", () => {

    it("Get All Posts: no posts", async() => {
        const response = await supertest(app).get('/posts');
        expect(response.body).toEqual({"posts": []});
        expect(response.statusCode).toBe(200);
    });

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

    afterAll(() =>{
        mongoose.connection.collection("users").drop();
        mongoose.connection.close();
        app.close();
    });
});