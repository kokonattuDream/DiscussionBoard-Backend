const app = require('../../server');
const session = require('supertest-session');
const mongoose = require('mongoose');

let testSession = session(app);
describe("Register/Log in Feature", () => {

    it("Sign Up a new user", async() =>{
        let newUserPayload = {
            "username": "test1",
            "password": "12345678"
        };
        
        let response = await testSession
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

        let response = await testSession
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

        let response = await testSession
            .delete('/user-session');
        
        expect(response.statusCode).toBe(204);
    });

    it("Log in with wrong password", async() => {
        let userPayload = {
            "username": "test1",
            "password": "999999999"
        };

        let response = await testSession
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

        let response = await testSession
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
    it("Create a New Post", async() => {

        let userPayload = {
            "username": "test1",
            "password": "12345678"
        };

        let postPayload = {
            file: 'null',
            data: '{"category":"Friends","region":"Ottawa","title":"Looking for friends in Ottawa","text":"Ottawa","username":"adminUser"}'
        };

        await testSession.post('/user-session').send(userPayload);

        let response = await testSession.post('/posts').send(postPayload);

        expect(response.body).toEqual({"message": "Post created successfully"});
        expect(response.statusCode).toBe(201);
    });

    it("Get Post", async() => {
        let response = await testSession.get('/posts');

        let expectedTitle = "Looking for friends in Ottawa";
        let expectedText = "Ottawa";

        expect(response.body.posts[0].title).toEqual(expectedTitle);
        expect(response.body.posts[0].text).toEqual(expectedText);
        expect(response.statusCode).toBe(200);
        postId = response.body.posts[0]._id;

        response = await testSession.get('/posts/'+ postId);
        expect(response.body.post._id).toEqual(postId);
        expect(response.body.post.title).toEqual(expectedTitle);
        expect(response.body.post.text).toEqual(expectedText);
        expect(response.statusCode).toBe(200);
    });
});

afterAll(() =>{
    mongoose.connection.collection("users").drop();
    mongoose.connection.collection("posts").drop();
    mongoose.connection.close();
    app.close();
});