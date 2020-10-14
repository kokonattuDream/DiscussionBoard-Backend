const mongoose = require('mongoose');
const httpMock = require('node-mocks-http');
const model = require('../../models/user');

const controller = require('../../controllers/userController');
const userPayload = require('../mockData/userPayload.json');

model.create = jest.fn();
model.findOne = jest.fn();

beforeEach(()=>{
    model.create.mockClear();
    model.findOne.mockClear();

    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = null;
    // if you set req.body =  . it fails as reference value is getting changed
    req.body = {...userPayload}
});

describe('Test user controller', () => {
    it("create user function is defined", () =>{
        expect(typeof controller.createUser).toBe('function');
    });
    
});