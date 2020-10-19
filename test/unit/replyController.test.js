const mockingoose = require('mockingoose').default;
const httpMock = require('node-mocks-http');
const replyModel = require('../../models/reply');
const postModel = require('../../models/post');
const Cache = require("../../lib/cache");

let req, res;

let replyController = require('../../controllers/replyController');

let post = require('./mockData/replyPost.json');
let savedReply = require('./mockData/reply.json');
let replyPayload = require('./mockData/replyPayload.json');
let savedPost = require('./mockData/replyPostSaved.json');

beforeEach(() => {
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    
    req.params = {};
    req.session = {};
    req.body = {}
});

describe("Add Reply",()=>{
    it("Add a valid reply", async() => {
        req.session.user = {
            "username": "adminUser",
            "_id": '507f191e810c19729de860ea'
        };
        req.body = replyPayload;
        mockingoose(replyModel).toReturn(savedReply, 'save');
        mockingoose(postModel).toReturn(post, 'findOne');
        mockingoose(postModel).toReturn(savedPost, 'save');
        
        Cache.set(replyPayload.post, post);

        await replyController.addReply(req, res);
        expect(res.statusCode).toBe(201);
    });

    it("Add a reply: Save Reply Failed", async() => {
        req.session.user = {
            "username": "adminUser",
            "_id": '507f191e810c19729de860ea'
        };
        req.body = replyPayload;
        mockingoose(replyModel).toReturn(new Error('Error'), 'save');
        mockingoose(postModel).toReturn(post, 'findOne');
    
        await replyController.addReply(req, res);
        expect(res.statusCode).toBe(500);
    });

    it("Add a reply: Find Post Failed", async() => {
        req.session.user = {
            "username": "adminUser",
            "_id": '507f191e810c19729de860ea'
        };
        req.body = replyPayload;
        mockingoose(replyModel).toReturn(savedReply);
        mockingoose(postModel).toReturn(new Error('Error'), 'findOne');
        mockingoose(postModel).toReturn(savedPost, 'save');

        await replyController.addReply(req, res);
        expect(res.statusCode).toBe(500);
    });

    it("Add a reply: Save Post with New Reply Failed", async() => {
        req.session.user = {
            "username": "adminUser",
            "_id": '507f191e810c19729de860ea'
        };
        req.body = replyPayload;
        mockingoose(replyModel).toReturn(savedReply);
        mockingoose(postModel).toReturn(post, 'findOne');
        mockingoose(postModel).toReturn(new Error('error'), 'save');

        await replyController.addReply(req, res);
        expect(res.statusCode).toBe(500);
    });
     
});