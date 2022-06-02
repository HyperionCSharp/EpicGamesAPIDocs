# Reputation
The reputation API was used to generate the Arkose blob (Deprecated). It is now used to generate the EPIC_SESSION_REPUATION cookie from the response. This can be used to authenticate the login API and allows the captcha to flow into the login form.

## Request
| URL | Method |
| - | - |
| https://www.epicgames.com/id/api/reputation | `GET` |

## Cookies
- `EPIC_SESSION_REPUTATION`: The authenticated token to validate a user has gone through all the steps needed to login and is now ready to login to his/her account.