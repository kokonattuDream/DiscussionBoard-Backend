const mockingoose = require('mockingoose').default;;
const httpMock = require('node-mocks-http');
const model = require('../../models/user');
const Cache = require("../../lib/cache");
const passwordHelper = require("../../lib/passwordHelper");

let req, res;

let controller = require('../../controllers/userController');

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    
    req.params = {};
    req.session = {};
    req.body = {}
});

describe("Create New User",() => {
    it("createUser function is defined", ()=> {
        expect(typeof controller.createUser).toBe('function');
    });

    it("Create a valid user", async()=>{
        let payload = {
            username: "me",
            password: "greatgreat",
            confirmPassword: "greatgreat"
        }
        req.body = payload;

        mockingoose(model).toReturn(null, 'findOne');

        await controller.createUser(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual({ 
            message: 'User successfully created',
            user: {
                username: payload.username
            }
         });
    });

    it("Create an user with empty", async()=>{
        let payload = {
            username: "",
            password: "",
            confirmPassword: ""
        }
        req.body = payload;

        await controller.createUser(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual({ 
            error: 'Cannot submit empty fields'
         });
    });

    it("Create an user with password not match", async()=>{
        let payload = {
            username: "testets",
            password: "aegeegeggege",
            confirmPassword: "6h5h5h5h5h"
        }
        req.body = payload;

        await controller.createUser(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual({ 
            error: 'Password not match'
         });
    });

    it("Create an user with password less than 5 characters", async()=>{
        let payload = {
            username: "testets",
            password: "1",
            confirmPassword: "1"
        }
        req.body = payload;

        await controller.createUser(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual({ 
            error: 'Password must be longer than 5 characters'
         });
    });

    it("Create an duplicate user", async()=>{
        let payload = {
            username: "me",
            password: "greatgreat",
            confirmPassword: "greatgreat"
        }
        req.body = payload;

        mockingoose(model).toReturn(payload, 'findOne');

        await controller.createUser(req, res);

        expect(res.statusCode).toBe(409);
        expect(res._getJSONData()).toStrictEqual({ 
            error: 'Username already exist'
         });
    });
});

describe("Log in",() => {
    it("createUser function is defined", ()=> {
        expect(typeof controller.loginUser).toBe('function');
    });

    it("Login with a valid authentication", async()=>{
        let payload = {
            username: "me",
            password: "greatgreat"
        }
        req.body = payload;

        let sampleUser = {
            _id: "243242",
            username: "me",
            password: passwordHelper.encryptPassword(payload.password)
        }
        mockingoose(model).toReturn(sampleUser, 'findOne');

        await controller.loginUser(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({ 
            message: 'User successfully logined', 
            user: {
                username: payload.username,
            }
        });
    });

    it("Login with a wrong password", async()=>{
        let payload = {
            username: "me",
            password: "greatgreat"
        }
        req.body = payload;

        let sampleUser = {
            username: "me",
            password: passwordHelper.encryptPassword("badbadbad")
        }
        mockingoose(model).toReturn(sampleUser, 'findOne');

        await controller.loginUser(req, res);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toStrictEqual({ 
            error: 'Password is incorrect'
        });
    });

    it("Login with a non-existed user", async()=>{
        let payload = {
            username: "me",
            password: "greatgreat"
        }
        req.body = payload;

        mockingoose(model).toReturn(null, 'findOne');

        await controller.loginUser(req, res);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toStrictEqual({ 
            error: 'Username not found'
        });
    });

    it("Login with a empty", async()=>{
        let payload = {
            username: "",
            password: ""
        }
        req.body = payload;
        
        await controller.loginUser(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toStrictEqual({ 
            error: 'Cannot submit empty fields'
        });
    });
});