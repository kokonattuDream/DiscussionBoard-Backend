const mockingoose = require('mockingoose').default;;
const httpMock = require('node-mocks-http');
const model = require('../../models/post');
const Cache = require("../../lib/cache");

let req, res;

let controller = require('../../controllers/postController');
let postData = require('./mockData/postData.json');
let userData = require('./mockData/userData.json');

beforeEach(()=>{
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    
    req.params = {};
    req.session = {};
    req.body = {}
});

let allPosts = require('./mockData/allPosts.json');
describe("Get All Post", ()=>{

    it('Get all posts', async() => {
        model.schema.path('user', Object);
        mockingoose(model).toReturn(allPosts, 'find');
        await controller.getAllPosts(req, res);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ posts: allPosts });
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

    it('Get post by id', async() => {
        req.params.id = onePost._id;
        model.schema.path('user', Object);
        model.schema.path('replies', Object);
        mockingoose(model).toReturn(onePost, 'findOne');

        await controller.getPost(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual({ post: onePost });
    });
});

describe("Create Post",()=>{
 
    it("createPost function is defined", ()=> {
        expect(typeof controller.createPost).toBe('function');
    });

    it('should create a valid post', async() => {
        let payload = '{ "title": "Current Job market?", "text": "How hard to find a job?","category": "Work","region": "Toronto"}';
        let createDate = new Date();
        postData.createDate = createDate;
        postData.updatedDate = createDate;
        req.session.user = userData;
        req.body.data = payload;
        
        mockingoose(model).toReturn(postData, 'create');
        mockingoose(model).toReturn(postData, 'save');
        
        await controller.createPost(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toStrictEqual({ message: "Post created successfully" });
        
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
    });

    it('should return 500 if save to mongodb failed', async() =>{
        req.session.user = userData;
        await controller.createPost(req, res);
        expect(res.statusCode).toBe(500);
    });
});