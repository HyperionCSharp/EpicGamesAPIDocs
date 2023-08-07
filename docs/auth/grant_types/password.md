# Authenticating by Password
This grant type, `password`, can be used to generate an access token with an email address and password.  
However, this grant type has been deprecated on all public clients.

## Method
- Send a `POST` request to https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token:  
  Required headers:
  - `Content-Type`: application/x-www-form-urlencoded  
  - `Authorization`: basic `clientId:secret` (encoded in Base64, [list of clients here](https://github.com/HyperionCSharp/EpicGamesAPIDocs/blob/main/docs/auth/auth_clients.md))    
  
  Body:
  - `grant_type`: password
  - `username`: (email address of account)
  - `password`: (password of account)

## Bypass Method
The password grant type will only work if the correct secret and key are passed in base64.
We must have the external authentication key to read/write/create data passed from Epic's server.

I will provide the secret auth token that can read/write account data.
I suspect this will be patched once posted so im making a bypass method.
