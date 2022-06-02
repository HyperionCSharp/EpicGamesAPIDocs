# CSRF / XSRF Token
CSRF stands for Cross Site Request Forgery, this API allows us to generate a special token to bypass the CSRF policys. The token can be found in the cookies of the response.

## Request
| URL | Method |
| - | - |
| https://www.epicgames.com/id/api/csrf | `GET` |

# Cookies
- `XSRF-TOKEN`: This is the main csrf token that can be used to bypass CSRF policys on the Epic Games Service's
- `EPIC_SESSION_AP`: This is the main session token that is generated with a call that allows CSRF bypassing/generating.