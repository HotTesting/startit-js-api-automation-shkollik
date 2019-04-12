import * as request from "request-promise-native";

export class Request{
    protected client = request;
    protected options: request.OptionsWithUri;


    constructor(absoluteURL: string){
        this.options = {
            uri: absoluteURL,
            method: "GET"
        };

        this.client = request.defaults({
            json: true,
            time: true,
            resolveWithFullResponse: true,
            followAllRedirects: true            
        });
    }

    public method(type: "GET" | "POST"){
        this.options.method = type;
        return this;
    }

    public body(body){
        this.options.body = body;
        return this;
    }

    public headers(headers: Object){
        this.options.headers = headers;
        return this;
    }

    public queryParameters(queryParameters: Object){
        this.options.qs = queryParameters;
        return this;
    }

    public async send(): Promise<request.FullResponse>{
        let response = await this.client(this.options);
        return response;
    }
}