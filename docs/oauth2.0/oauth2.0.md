# The OAuth 2.0 Authorization Framework
The OAuth 2.0 authorization framework enables a third-party application to obtain limited access to an HTTP service, either on behalf of a resource owner by orchestrating an approval interaction between the resource owner and the HTTP service, or by allowing the third-party application to obtain access on its own behalf.

## Roles
OAuth defines four roles:

- `resource owner`: An entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an end-user.
- `resource server`: The server hosting the protected resources, capable of accepting and responding to protected resource requests using access tokens.
- `client`: An application making protected resource requests on behalf of the resource owner and with its authorization.  The term "client" does not imply any particular implementation characteristics (e.g., whether the application executes on a server, a desktop, or other devices).
- `authorization server`: The server issuing access tokens to the client after successfully authenticating the resource owner and obtaining authorization.

The interaction between the authorization server and resource server is beyond the scope of this specification. The authorization server may be the same server as the resource server or a separate entity. A single authorization server may issue access tokens accepted by multiple resource servers.

## Protocol Flow
```
+--------+                               +---------------+
|        |--(A)- Authorization Request ->|   Resource    |
|        |                               |     Owner     |
|        |<-(B)-- Authorization Grant ---|               |
|        |                               +---------------+
|        |
|        |                               +---------------+
|        |--(C)-- Authorization Grant -->| Authorization |
| Client |                               |     Server    |
|        |<-(D)----- Access Token -------|               |
|        |                               +---------------+
|        |
|        |                               +---------------+
|        |--(E)----- Access Token ------>|    Resource   |
|        |                               |     Server    |
|        |<-(F)--- Protected Resource ---|               |
+--------+                               +---------------+
```

Abstract Protocol Flow ^

- (A): The client requests authorization from the resource owner. The authorization request can be made directly to the resource owner (as shown), or preferably indirectly via the authorization server as an intermediary.

- (B): The client receives an authorization grant, which is a credential repersenting the resource owner's authorization, expressed using one of four grant types defined in this specification or using an extension grant type. The authorization grant type depends on the method used by the client to request authorization and the types supported by the authorization server.

- (C): The client requests an access token by authenticating with the authorization server and presenting the authorization grant.

- (D): The authorization server authenticates the client and validates the authorization grant, and if valid, issues an access token.

- (E): The client requests the protected resource from the resource server and authenticates by presenting the access token.

- (F): The resource server validates the access token, and if valid, serves the request.

## Authorization Grant

An authorization grant is a credential repersenting the resource owner's authorization (to access its protected resources) used by the client to obtain an access token. This specification defines four grant types:
- `authorization code`
- `implicit`
- `resource owner credentials`
- `client credentials`

as well as an extensibility mechanism for defining additional types.

## Authorization Code

The authorization code is obtained by using an authorization server as an intermediary between the client and the resource owner. Instead of requesting authorization directly from the resource owner, the client directs the resource owner to an authorization server (via its user-agent), which in turn directs the resource owner back to the client with the authorization code.

Before directing the resource owner back to the client with the authorization code, the authorization server authenticates the resource owner and obtains authorization. Because the resource owner only authenticates with the authorization server, the resource owner's credentials are never shared with the client.

The authorization code provides a few important security benefits, such as the ability to authenticate the client, as well as the transmission of the access token directly to the client without passing it through the resource owner's user-agent and potentially exposing it to others, including the resource owner.

MORE TO COME STILL LEARNING OAUTH 2.0 FLOWS!!!
