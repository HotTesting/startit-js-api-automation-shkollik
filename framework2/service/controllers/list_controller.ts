import { Request } from "../../request";
import { Controller } from "./controller";
import { Board } from "../models/Board";

export class ListController extends Controller {
    bearerToken: string;

    constructor(BASE_URL?: string, cookieJar?, bearerToken?: string) {
        super(BASE_URL, cookieJar);
        this.bearerToken = bearerToken;
    }

    async createList(
        boardId: string,
        title: string
    ): Promise<{_id: string }> {
        let resp = await new Request(this.BASE_URL + `/api/boards/${boardId}/lists`)
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .method("POST")
            .body({
                title: title
            })
            .send();        

        return resp.body;
    }

    async deleteList(
        boardId: string,
        listId: string
    ): Promise<{ _id: string }> {
        let resp = await new Request(this.BASE_URL + `/api/boards/${boardId}/lists/${listId}`)
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .method("DELETE")
            .send();

        return resp.body;
    }
}