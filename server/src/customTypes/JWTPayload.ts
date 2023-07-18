/** This defines the structure of the jwt token paylaod */
interface JWTPayload {
  expiresIn: string; // Specifies when the token should expire
  issuer: string; // Indicates the issuer of the token
  subject: string; // Specifies the subject of the token, usually the user ID
  audience: string; // Where the token is intended to be used
  type: "refresh-token" | "access-token"; // The type of the token
}

export default JWTPayload;
