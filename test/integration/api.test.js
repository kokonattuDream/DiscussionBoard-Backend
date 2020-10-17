const app = require('../../app');
const session = require('supertest-session');
const mongoose = require('mongoose');

let testSession;

beforeAll(() =>{
    testSession = session(app);
});
describe("Register/Log in Feature", () => {

    it("Sign Up a new user", async() =>{
        let newUserPayload = {
            "username": "test1",
            "password": "12345678",
            "confirmPassword": "12345678"
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

    it("Sign Up an already existed user", async() =>{
        let newUserPayload = {
            "username": "test1",
            "password": "12345678",
            "confirmPassword": "12345678"
        };
        
        let response = await testSession
            .post('/users')
            .send(newUserPayload);
        
        expect(response.statusCode).toBe(409);
        expect(response.body).toEqual({
            "error": 'Username already exist'
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

    it("Log in with wrong password", async() => {
        let userPayload = {
            "username": "test1",
            "password": "999999999"
        };

        let response = await testSession
            .post('/user-session')
            .send(userPayload);
        
        expect(response.statusCode).toBe(401);
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

let postId = null;

describe("Posts and Replies", () =>{
    it("Create a New Post", async() => {

        let userPayload = {
            "username": "test1",
            "password": "12345678"
        };

        let postPayload = {
            file: 'null',
            data: '{"category":"Friends","region":"Ottawa","title":"Looking for friends in Ottawa","text":"Ottawa","username":"adminUser"}'
        };

        //await testSession.post('/user-session').send(userPayload);

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

    it("Reply to Post", async() => {

        let userPayload = {
            "username": "test1",
            "password": "12345678"
        };

        let replyPayload = {
            user: 'test1',
            reply: 'It\'s okay',
            post: postId
        };
        //await testSession.post('/user-session').send(userPayload);
        let response = await testSession.post('/replies').send(replyPayload);

        expect(response.body).toEqual({ "message": "Reply submitted" });
        expect(response.statusCode).toBe(201);
    });
});

describe("Non Login users", () =>{

    it("Log out", async() => {

        let response = await testSession
            .delete('/user-session');
        
        expect(response.statusCode).toBe(204);
    });


    it("Non-Login User create a Post", async() => {

        let postPayload = {
            file: 'null',
            data: '{"category":"Friends","region":"Ottawa","title":"Looking for friends in Ottawa","text":"Ottawa","username":"adminUser"}'
        };

        let response = await testSession.post('/posts').send(postPayload);

        expect(response.body).toEqual({"message": "Login Required"});
        expect(response.statusCode).toBe(403);
    });

    it("Non-Login user reply to Post", async() => {

        let replyPayload = {
            user: '',
            reply: 'It\'s okay',
            post: postId
        };

        let response = await testSession.post('/replies').send(replyPayload);

        expect(response.body).toEqual({ "message": "User Login Required" });
        expect(response.statusCode).toBe(403);
    });
});

afterAll(async () =>{
    await mongoose.connection.collection("users").drop();
    await mongoose.connection.collection("posts").drop();
    await mongoose.connection.collection("replies").drop();
    
    mongoose.connection.close();
});