import {Request} from "../lib/request"
import * as faker from "faker"
import {expect} from "chai"

const domain:string = "ip-5236.sunline.net.ua";
const origin:string = "http://ip-5236.sunline.net.ua:30020";
const rootEmail:string = "wekan_superadmin@ip-5236.sunline.net.ua";
const rootPassword:string = "wekan_superadmin@ip-5236.sunline.net.ua";

describe("User API", function(){
     it("User register should be successful", async function(){
        //get token
        let adminLoginResponse = await new Request(`${origin}/users/login`)
        .method("POST")
        .body(
            {
                email: rootEmail,
                password: rootPassword
            }
        )
        .send();  

        let createUserResponse = await new Request(`${origin}/api/users`)
            .method("POST")
            .headers({
                Authorization: `Bearer ${adminLoginResponse.body.token}`
            })
            .body(
                {
                    username: faker.internet.userName(),
                    email: faker.internet.email(undefined, undefined, domain),
                    password: faker.internet.password(),
                    fromAdmin: true                               
                }
            )
            .send();   
            
        expect(createUserResponse).to.have.property('id');
    }); 
   
});