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

MORE TO COME SOON AS IM STILL LEARNING OAUTH 2.0 FLOWS!!