# Verify Access Token

## Offline Verification

The access token is a JWT (JSON Web Token) that includes a header and signature used to validate the authenticity of the token.

Before validating the signature, you will need to fetch a public key published as a [JSON Web Key(JWK)](https://tools.ietf.org/html/rfc7517) from our service. We expose a single endpoint using the [JWK Set](https://tools.ietf.org/html/rfc7517#section-5) format that includes all of the current public keys. While the keys are not changed frequently, it is possible that they are rotated at any time.

The JWK endpoint is ``https://api.epicgames.dev/epic/oauth/v1/.well-known/jwks.json``

Clients fetching the public key should cache them for a reasonable period. While the keys may rotate, a key for a given key ID will not change.

The following snippet shows a sample response from the public keys endpoint:

```json
{"keys":[{"kty":"RSA","e":"AQAB","kid":"WMS7EnkIGpcH9DGZsv2WcY9xsuFnZCtxZjj4Ahb-_8E","n":"l6XI48ujknQQlsJgpGXg4l2i_DuUxuG2GXTzkOG7UtX4MqkVBCfW1t1JIIc8q0kCInC2oBwhC599ZCmd-cOi0kS7Aquv68fjERIRK9oCUnF_lJg296jV8xcalFY0FOWX--qX3xGKL33VjJBMIrIu7ETjj06s-v4li22CnHmu2lDkrp_FPTVzFscn-XRIojqIFb7pKRFPt27m12FNE_Rd9bqlVCkvMNuE7VTpTOrSfKk5B01M5IuXKXk0pTAWnelqaD9bHjAExe2I_183lp_uFhNN4hLTjOojxl-dK8Jy2OCPEAsg5rs9Lwttp3zZ--y0sM7UttN2dE0w3F2f352MNQ"}]}
```

## Online Verification

If offline verification is not an option, you can perform an online verification by calling the token info endpoint with a valid access token. This endpoint implements the [Token Introspection](https://tools.ietf.org/html/rfc7662#section-2.1) specification.

The token info endpoint is ``https://api.epicgames.dev/epic/oauth/v1/tokenInfo``

The following snippet shows a sample request to verify a token:

```
POST /epic/oauth/v1/tokenInfo HTTP/1.1
Host: api.epicgames.dev
Content-Type: application/x-www-form-urlencoded
token=eyJ0IjoiZXBpY19pZCIsImFsZyI6IlJTMjU2Iiwia2lkIjoibldVQzlxSFVldWRHcnBXb3FvVXVHZkFIYmVWM2NsRnlsdFRYMzhFbXJKSSJ9.eyJhdWQiOiJ4eXphNzg5MWxoeE1WWUdDT043TGduS1paOEhRR0Q1SCIsInN1YiI6Ijk2MjZmNDQxMDU1MzQ5Y2U4Y2I3ZDdkNWE0ODNlYWEyIiwidCI6ImVwaWNfaWQiLCJzY29wZSI6ImJhc2ljX3Byb2ZpbGUgZnJpZW5kc19saXN0IHByZXNlbmNlIiwiYXBwaWQiOiJmZ2hpNDU2N08wM0hST3hFandibjdrZ1hwQmhuaFd3diIsImlzcyI6Imh0dHBzOlwvXC9hcGkuZXBpY2dhbWVzLmRldlwvZXBpY1wvb2F1dGhcL3YxIiwiZG4iOiJLcm5icnkiLCJleHAiOjE1ODgyODYwODMsImlhdCI6MTU4ODI3ODg4Mywibm9uY2UiOiJuLUI1cGNsSXZaSkJaQU1KTDVsNkdvUnJDTzNiRT0iLCJqdGkiOiI2NGMzMGQwMjk4YTM0MzdjOGE3NGU1OTAxYzM0ODZiNSJ9.MZRoCRpjIb--dD7hxoo2GvjSPhUSNpOq1FhtShTBmzMJ1qlHFPzNaUiAEETAc3mabGPKyOxUP6Q1FBadr_P_UtbtB7kf34hN2VTv5czW6WOx1HdpjwUQZuxFyDc_aix7FCS0Egu4rZlC65b-B0FUVlial_s_FrH8ou5L_d-4I0KVpIwtv-b_M6EQ9jtLdQRfMaP6aV0rIerrbqFZ617Pe7XT4IO9jZFwM8F5aDTeDHkkOO41wyVibrm38799lP4B65RIv9CwbAL-TVmV1L5gFYITaZhi5ShfZzTvxAk-3Dxwp8c5JvcO68zpbya5gFSAfhsd7vt9YLU0gQR2uXq3Vw
```

The following snippet shows a sample response from the token info endpoint:

```json
{
  "active": true,
  "scope": "basic_profile friends_list presence",
  "token_type": "bearer",
  "expires_in": 6761,
  "expires_at": "2020-04-30T22:34:43.549Z",
  "account_id": "9626f441055349ce8cb7d7d5a483eaa2",
  "client_id": "xyza7891lhxMVYGCON7LgnKZZ8HQGD5H",
  "application_id": "fghi4567O03HROxEjwbn7kgXpBhnhWwv"
}
```

Both access tokens and refresh tokens can be verified using this endpoint.
