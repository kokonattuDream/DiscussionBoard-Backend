const mockingoose = require('mockingoose').default;
const httpMock = require('node-mocks-http');
const replyModel = require('../models/reply');
const postModel = require('../models/post');
const Cache = require("../lib/cache");

let req, res;

let replyController = require('../controllers/replyController');
let postController = require('../controllers/postController');

let post = require('./mockData/replyPost.json');
let userData = require('./mockData/userData.json');
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
    it("Add a valid replay", async() => {
        req.session.user = {
            "username": "adminUser"
        };
        req.body = replyPayload;
        mockingoose(replyModel).toReturn(savedReply);
        mockingoose(postModel).toReturn(post, 'findOne');
        mockingoose(postModel).toReturn(savedPost, 'save');
        
        Cache.set(replyPayload.post, post);

        await replyController.addReply(req, res);
        expect(res.statusCode).toBe(201);

        let cachePost = Cache.get(replyPayload.post);

        expect(cachePost.replies[0].text).toEqual(replyPayload.reply);
        expect(cachePost.replies[0].user.username).toEqual(replyPayload.user);
        Cache.del(replyPayload.post);
    });
     
});