# Friends Incoming
This API lets you see your incoming friend requests without logging into Fortnite.

## Request
| URL | Method |
| - | - |
| https://friends-public-service-prod.ol.epicgames.com/friends/api/v1/{id}/incoming | `GET` |

## Query Parameters
- `id`: Your Account Id 

## Required Headers
- `Content-Type`: `application/x-www-form-urlencoded`
- `Authorization`: bearer `access_token` (Make sure that the access token is vaild if its not i recommend [using client_credentials](https://github.com/HyperionCSharp/EpicGamesAPIDocs/blob/main/docs/auth/grant_types/client_credentials.md))
