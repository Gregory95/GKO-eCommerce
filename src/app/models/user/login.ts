import { Token } from "./token";

export class LoginModel {
    normalizedEmail: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    tokenObj: Token | undefined;
}