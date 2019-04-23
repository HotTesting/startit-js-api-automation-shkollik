import { Request } from "../../request";
import { Controller } from "./controller";
import { Board } from "../models/Board";

export class CardController extends Controller {
    bearerToken: string;

    constructor(BASE_URL?: string, cookieJar?, bearerToken?: string) {
        super(BASE_URL, cookieJar);
        this.bearerToken = bearerToken;
    }

    async createCard(
        boardId: string,
        listId: string,
        title: string,
        description: string,
        authorId: string,
        swimlaneId: string
    ): Promise<{_id: string }> {
        let resp = await new Request(this.BASE_URL + `/api/boards/${boardId}/lists/${listId}/cards`)
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .method("POST")
            .body({
                title: title,
                description: description,
                authorId: authorId,
                swimlaneId: swimlaneId
            })
            .send();        

        return resp.body;
    }

    async deleteCard(
        boardId: string,
        listId: string,
        cardId: string
    ): Promise<{ _id: string }> {
        let resp = await new Request(this.BASE_URL + `/api/boards/${boardId}/lists/${listId}/cards/${cardId}`)
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .method("DELETE")
            .send();

        return resp.body;
    }
}