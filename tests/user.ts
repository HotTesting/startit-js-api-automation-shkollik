import {Request} from "../lib/request"
import * as faker from "faker"
import {expect} from "chai"

const chai = require('chai');
const assertArrays = require('chai-arrays');
chai.use(assertArrays);

const domain:string = "ip-5236.sunline.net.ua";
const origin:string = "http://ip-5236.sunline.net.ua:30020";
const rootEmail:string = "test@test.com";
const rootPassword:string = "123456";
let rootToken:string;
let testUserName:string;
let testUserPassword:string;
let testUserEmail:string;
let testUserId:string;


describe("User API", function(){
    beforeEach("create a test user", async function(){
        let adminLoginResponse = await new Request(`${origin}/users/login`)
                                        .method("POST")
                                        .body(
                                            {
                                                email: rootEmail,
                                                password: rootPassword
                                            },
                                        )
                                        .send();  
        rootToken = adminLoginResponse.body.token

        testUserName = faker.internet.userName();
        testUserPassword = faker.internet.password(11);
        testUserEmail = faker.internet.email(undefined, undefined, domain); 
    
        let createUserResponse = await new Request(`${origin}/api/users`)
                                        .method("POST")
                                        .headers({
                                            Authorization: `Bearer ${rootToken}`
                                        })
                                        .body(
                                            {
                                                username: testUserName,
                                                password: testUserPassword,
                                                email: testUserEmail                                       
                                            }
                                        )
                                        .send(); 

        testUserId = createUserResponse.body._id;        
    });

    afterEach("delete a test user", async function(){
        let deleteResponse = await new Request(`${origin}/api/users/${testUserId}`)
                                    .method("DELETE")
                                    .headers({
                                        Authorization: `Bearer ${rootToken}`
                                    })
                                    .send();
    });

    it("Should retrieve information about a logged-in user with his auth token", async function(){
        //get token
        let testUserLoginResponse = await new Request(`${origin}/users/login`)
                                            .method("POST")
                                            .body(
                                                {
                                                    email: testUserEmail,
                                                    password: testUserPassword
                                                },
                                            )
                                            .send();  
    
        let testUserInfoResponse = await new Request(`${origin}/api/user`)
                                            .method("GET")
                                            .headers({
                                                Authorization: `Bearer ${testUserLoginResponse.body.token}`
                                            })
                                            .send();  
             
        expect(testUserInfoResponse.body._id, "TestUserId").to.equal(testUserId);
        expect(testUserInfoResponse.body.username, "TestUserName").to.equal(testUserName);
     });

     it("Should not retrieve information about a user without a valid token", async function(){
    
        let unauthorizedTestUserInfoResponse = await new Request(`${origin}/api/user`)
                                                        .method("GET")
                                                        .headers({
                                                            Authorization: `Bearer ${faker.internet.password}`
                                                        })
                                                        .send();  

        expect(unauthorizedTestUserInfoResponse.body.statusCode, "Unauthorized statusCode").to.equal(401);        
     });   

     it("Should retrieve the users list", async function(){    
        let usersLisResponse = await new Request(`${origin}/api/users`)
                                            .method("GET")
                                            .headers({
                                                Authorization: `Bearer ${rootToken}`
                                            })
                                            .send();                      
        
        chai.expect(usersLisResponse.body).to.be.array();        
        chai.expect(usersLisResponse.body).not.to.be.ofSize(0); //as at least one user is created via beforeall function   
     });

     it("Should retrieve information about a user using a root token", async function(){    
        let testUserInfoResponse = await new Request(`${origin}/api/users/${testUserId}`)
                                            .method("GET")
                                            .headers({
                                                Authorization: `Bearer ${rootToken}`
                                            })
                                            .send(); 
                      
        expect(testUserInfoResponse.body._id, "TestUserId").to.equal(testUserId);
        expect(testUserInfoResponse.body.username, "TestUserName").to.equal(testUserName); 
     });
});