const mockingoose = require('mockingoose').default;;
const httpMock = require('node-mocks-http');
let controller = require('../../controllers/healthController');

it("Test health check", async() =>{
    let req = httpMock.createRequest();
    let res = httpMock.createResponse();
    await controller.healthCheck(req, res);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({message: "Health Check Passed"});
});