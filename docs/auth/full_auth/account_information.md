# Account Information

Once you have an access token, you will be able to make requests to Epic services on behalf of the user. For example you can make requests to retrieve their display name, or the display names of their friends.

## From the Access Token

You can retrieve some information directly from the access token. The token is encoded as a [JSON Web Token(JWT)](https://tools.ietf.org/html/rfc7519), and its header includes information about the type of token and signature it usesm as well as a payload with information about the user, your client, the session, and a signature. I recommend using a library to handle decoding the JWT, but if this is not possible, refer to the JWT specification.

The payload will include the following information:

| Claim | Type | Description |
| - | - | - |
| `iss` | string | The base URL of the Epic Games authentication server that issued the token. |
| `sub` | string | This claim will not be present when using the client_credentials grant type. |
| `aud` | string | The client ID specified in the authorization request. |
| `iat` | integer | The time the token was issued as a UNIX timestamp. |
| `exp` | integer | Expiration time of the token as a UNIX timestamp. |
| `jti` | string | The unique identifier for this token. |
| `t` | string | The type of token. This should always be epic_id. This replaces the version prefix that we have with EG1 tokens. |
| `scope` | string | Space delimited list of scopes that were authorized by the user. |
| `dn` | string | The user's display name. |
| `appid` | string | The application ID specified in the authorization request. |
| `pfpid` | string | The product ID for the deployment that was specified in the token request. |
| `pfsid` | string | The sandbox ID for the deployment that was specified in the token request. |
| `pfdid` | string | The deployment ID that was specified in the token request. |

Using the token from the previous example, we can decode the payload to see that it includes the following:

```json
{
  "aud": "xyza7891lhxMVYGCON7LgnKZZ8HQGD5H",
  "sub": "9626f441055349ce8cb7d7d5a483eaa2",
  "t": "epic_id",
  "scope": "basic_profile friends_list presence",
  "appid": "fghi4567O03HROxEjwbn7kgXpBhnhWwv",
  "iss": "https://api.epicgames.dev/epic/oauth/v1",
  "dn": "Krnbry",
  "exp": 1588286083,
  "iat": 1588278883,
  "nonce": "n-B5pclIvZJBZAMJL5l6GoRrCO3bE=",
  "jti": "64c30d0298a3437c8a74e5901c3486b5"
}
```

## Fetching Accounts

In addition to the information in the access token, it is possible to request similar information about the logged-in account, or any other account that has interacted with your application.

```
Due to privacy concerns, you will only be able to request account information for users who have previously provided consent to your application.
```

The account info endpoint is `https://api.epicgames.dev/epic/id/v1/accounts`. When calling this endpoint, you will need to specify one or more accountId query parameters for the accounts you are trying to resolve. There is a limit of `50` accounts in a single request.

The following snippet shows a sample request to fetch multiple accounts:

```
GET /epic/id/v1/accounts?accountId=foo531f86d911d74f4aa8399849e9ca9ba6&accountId=barcbab941052f540c69fbd92ddc3bf9027 HTTP/1.1
Host: api.epicgames.dev
Content-Type: application/x-www-form-urlencoded
Authorization: Bearer [token]eyJ0IjoiZXBpY19pZCIsImFsZyI6IlJTMjU2Iiwia2lkIjoibldVQzlxSFVldWRHcnBXb3FvVXVHZkFIYmVWM2NsRnlsdFRYMzhFbXJKSSJ9.eyJhdWQiOiJ4eXphNzg5MWxoeE1WWUdDT043TGduS1paOEhRR0Q1SCIsInN1YiI6Ijk2MjZmNDQxMDU1MzQ5Y2U4Y2I3ZDdkNWE0ODNlYWEyIiwidCI6ImVwaWNfaWQiLCJzY29wZSI6ImJhc2ljX3Byb2ZpbGUgZnJpZW5kc19saXN0IHByZXNlbmNlIiwiYXBwaWQiOiJmZ2hpNDU2N08wM0hST3hFandibjdrZ1hwQmhuaFd3diIsImlzcyI6Imh0dHBzOlwvXC9hcGkuZXBpY2dhbWVzLmRldlwvZXBpY1wvb2F1dGhcL3YxIiwiZG4iOiJLcm5icnkiLCJleHAiOjE1ODgyODYwODMsImlhdCI6MTU4ODI3ODg4Mywibm9uY2UiOiJuLUI1cGNsSXZaSkJaQU1KTDVsNkdvUnJDTzNiRT0iLCJqdGkiOiI2NGMzMGQwMjk4YTM0MzdjOGE3NGU1OTAxYzM0ODZiNSJ9.MZRoCRpjIb--dD7hxoo2GvjSPhUSNpOq1FhtShTBmzMJ1qlHFPzNaUiAEETAc3mabGPKyOxUP6Q1FBadr_P_UtbtB7kf34hN2VTv5czW6WOx1HdpjwUQZuxFyDc_aix7FCS0Egu4rZlC65b-B0FUVlial_s_FrH8ou5L_d-4I0KVpIwtv-b_M6EQ9jtLdQRfMaP6aV0rIerrbqFZ617Pe7XT4IO9jZFwM8F5aDTeDHkkOO41wyVibrm38799lP4B65RIv9CwbAL-TVmV1L5gFYITaZhi5ShfZzTvxAk-3Dxwp8c5JvcO68zpbya5gFSAfhsd7vt9YLU0gQR2uXq3Vw
```

The following snippet is an example response from this request:

```json
[
    {
        "accountId": "531f86d911d74f4aa8399849e9ca9ba6",
        "displayName": "eas_user",
        "preferredLanguage": "en",
        "linkedAccounts": [
            {
                "identityProviderId": "xbl",
                "displayName": "eas_user_xbl"
            }
        ]
    },
    {
        "accountId": "cbab941052f540c69fbd92ddc3bf9027",
        "displayName": "other_user",
        "preferredLanguage": "en"
    }
]
```