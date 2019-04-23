import {Request} from "../framework2/request"
import {UserController} from "../framework2/service/controllers/user_controller"
import {BoardController} from "../framework2/service/controllers/board_controller"
import {SwimlaneController} from "../framework2/service/controllers/swimlane_controller"
import {ListController} from "../framework2/service/controllers/list_controller"
import {CardController} from "../framework2/service/controllers/card_controller"
import * as faker from "faker"
import {expect} from "chai"

const domain:string = "ip-5236.sunline.net.ua";
const origin:string = "http://ip-5236.sunline.net.ua:30020";
const rootEmail:string = "test@test.com";
const rootPassword:string = "123456";
let rootToken:string;
let testUserName:string;
let testUserPassword:string;
let testUserEmail:string;
let testUserId:string;
let testBoardId:string;
let testSwimlaneId:string;
let testListId:string;
let testCardId:string;


describe("Card API", function(){
    beforeEach("create a test user, board, list", async function(){
        //get token
        let userController = new UserController();
        let adminLoginResponse = await userController.login(rootEmail, rootPassword);
        rootToken = adminLoginResponse.token;
        
        //create user
        testUserName = faker.internet.userName();
        testUserPassword = faker.internet.password(11);
        testUserEmail = faker.internet.email(undefined, undefined, domain); 
        let adminUserController = new UserController(origin, undefined, rootToken);
        let createUserResponse = await adminUserController.createUser(testUserEmail, testUserPassword, testUserName);
        testUserId = createUserResponse._id;   
        
        //create board
        let boardController = new BoardController(origin, undefined, rootToken);
        let testBoardName = faker.random.word.toString();
        let testBoardPermission = "private";
        let testBoardColor = "nephritis";
        let boardCreationResponse = await boardController.createBoard(testBoardName, testUserId, testBoardPermission, testBoardColor);
        testBoardId = boardCreationResponse._id;
        
        //create swimlane
        let testSwimlaneTitle = faker.random.word.toString();
        let swimlaneController = new SwimlaneController(origin, undefined, rootToken);
        let createSwimlaneResponse = await swimlaneController.createSwimlane(testBoardId, testSwimlaneTitle);
        testSwimlaneId = createSwimlaneResponse._id;

        //create list
        let testListTitle = faker.random.word.toString();
        let listController = new ListController(origin, undefined, rootToken);
        let createListResponse = await listController.createList(testBoardId, testListTitle);
        testListId = createListResponse._id;
    });

    afterEach("delete a test user, board, list", async function(){
        let adminUserController = new UserController(origin, undefined, rootToken);
        let deleteUserResponse = await adminUserController.deleteUser(testUserId);

        let boardController = new BoardController(origin, undefined, rootToken);
        let deleteBoardResponse = await boardController.deleteBoard(testBoardId);

        let swimlaneController = new SwimlaneController(origin, undefined, rootToken);
        let deleteSwimlaneResponse = await swimlaneController.deleteSwimlane(testBoardId, testSwimlaneId);

        let listController = new ListController(origin, undefined, rootToken);
        let deleteListResponse = await listController.deleteList(testBoardId, testListId);

        let cardController = new CardController(origin, undefined, rootToken);
        let deleteCardResponse = await cardController.deleteCard(testBoardId, testListId, testCardId);
    });

    it("Should create a card", async function(){
        //create list
        let testCardTitle = faker.random.word.toString();
        let testCardDescrition = faker.random.word.toString();
        let cardController = new CardController(origin, undefined, rootToken);
        let createCardResponse = await cardController.createCard(testBoardId, testListId, testCardTitle, testCardDescrition, testUserId, testSwimlaneId);
        testCardId = createCardResponse._id;

        expect(createCardResponse, JSON.stringify(createCardResponse))
            .to.be.an("object")
            .that.has.key("_id");
     });

     
});