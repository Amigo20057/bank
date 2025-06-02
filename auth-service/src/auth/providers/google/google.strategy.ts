import { status } from "@grpc/grpc-js";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth20";
import { UserClientService } from "src/auth/user.client";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    public constructor(
        config: ConfigService,
        private readonly userClient: UserClientService,
    ) {
        super({
            clientID: config.getOrThrow("GOOGLE_CLIENT_ID"),
            clientSecret: config.getOrThrow("GOOGLE_CLIENT_SECRET"),
            callbackURL: config.getOrThrow("GOOGLE_REDIRECT_URI"),
            scope: ["email", "profile"],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
    ): Promise<any> {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            throw new BadRequestException("Google account has no email");
        }

        let user = null;

        try {
            user = await this.userClient.GetUserByEmail(email);
        } catch (error) {
            if (error.code !== status.NOT_FOUND) {
                throw new BadRequestException("gRPC error: " + error.message);
            }
        }

        if (!user) {
            user = await this.userClient.createUser({
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                email,
                telephoneNumber: "",
                password: "",
                address: "",
                dateOfBirth: null,
                passportNumber: "",
                avatar: profile.photos?.[0]?.value || "",
                googleId: profile.id,
                isVerified: profile.emails?.[0]?.verified ?? true,
            });
        }

        return user;
    }
}
