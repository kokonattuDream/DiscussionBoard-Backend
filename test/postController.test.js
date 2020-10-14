let controller = require('../controllers/postController');
const mockingoose = require('mockingoose').default;;
const model = require('../models/post');
const httpMock = require('node-mocks-http');
const Cache = require("../lib/cache");

let req, res;

let postData = require('./mockData/postData.json');
let userData = require('./mockData/userData.json');

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    
    req.params = {};
    req.session = {};
    req.body = {}
});

describe("Create Post",()=>{
 
    it("createPost function is defined", ()=> {
        expect(typeof controller.createPost).toBe('function');
    });

    it('should create a valid post', async() => {
        let payload = '{ "title": "Current Job market?", "text": "How hard to find a job?","category": "Work","region": "Toronto"}';
        
        req.session.user = userData;
        req.body.data = payload;
        mockingoose(model).toReturn(postData, 'save');
        
        await controller.createPost(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual({ message: "Post created successfully" });
        
        let cacheData = Cache.get(JSON.stringify(postData._id));
 
        delete postData.user._id;
        verifyCacheContent(cacheData, postData);
        Cache.del(JSON.stringify(postData._id));
    });

    it('should fail to create post without login', async() => {
        let payload = { 
            "title": "Current Job market?",
            "text": "How hard to find a job?",
            "category": "Work",
            "region": "Toronto"
        };
        req.body.data = JSON.stringify(payload);
        req.session.user = null;
        mockingoose(model).toReturn(postData, 'save');
        
        await controller.createPost(req, res);
        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toStrictEqual({ message: "Login Required" });

        let cacheData = Cache.get(JSON.stringify(postData._id));
        expect(cacheData).toBeUndefined();
    });

    it('should return 500 if save to mongodb failed', async() =>{
        req.session.user = userData;
        await controller.createPost(req, res);
        expect(res.statusCode).toBe(500);
    });
});

let allPosts = require('./mockData/allPosts.json');
describe("Get All Post", ()=>{
 

    it('Get all posts When Database Failed', async() => {
        model.schema.path('user', Object);
        mockingoose(model).toReturn(new Error(''), 'find');
        await controller.getAllPosts(req, res);
        expect(res.statusCode).toBe(500);
    });

    it('Get all posts when cache is empty', async() => {
        model.schema.path('user', Object);
        mockingoose(model).toReturn(allPosts, 'find');
        await controller.getAllPosts(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({ posts: allPosts });
        
        for(let i in allPosts){
            verifyCacheContent( Cache.get(JSON.stringify(allPosts[i]._id)), allPosts[i]);
        }
    });

    it('Get all posts when cache has it', async() => {
        await controller.getAllPosts(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({ posts: allPosts });
    });

    afterAll(()=>{
        for(let i in allPosts){
            Cache.del(JSON.stringify(allPosts[i]._id));
        } 
    });
});

let onePost = require('./mockData/post.json');
describe("Get a single Post by id", () => {

    it('Get post by id not exist', async() => {
        req.params.id = onePost._id;
        mockingoose(model).toReturn(null, 'findOne');

        await controller.getPost(req, res);

        expect(res.statusCode).toBe(404);
    });

    it('Get post by id when cache is empty', async() => {
        req.params.id = onePost._id;
        model.schema.path('user', Object);
        model.schema.path('replies', Object);
        mockingoose(model).toReturn(onePost, 'findOne');

        await controller.getPost(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({ post: onePost });

        let cacheData = Cache.get(JSON.stringify(onePost._id));
        
        verifyCacheContent(cacheData, onePost);
    });

    it('Get post by id in Cache', async() => {
        req.params.id = onePost._id;

        await controller.getPost(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({ post: onePost });

        let cacheData = Cache.get(JSON.stringify(onePost._id));
        
        verifyCacheContent(cacheData, onePost);
    });
    
});

function verifyCacheContent(cache, original){
    expect(cache.imageId).toEqual(original.imageId);
    expect(cache.imageUrl).toEqual(original.imageUrl);
    expect(cache.title).toEqual(original.title);
    expect(cache.user).toEqual(original.user);
    expect(cache.text).toEqual(original.text);
    expect(cache.category).toEqual(original.category);
    expect(cache.region).toEqual(original.region);
}