# CSRF / XSRF Token
CSRF stands for Cross Site Request Forgery, this API allows us to generate a special token to bypass the CSRF policys. The token can be found in the cookies of the response. *The old CSRF endpoint is now forbidden and wont show the needed cookies.*

*Updated 03/05/24
The **SID=** is the sessionID and does not need to change in order to receive new csrf tokens for now.

## Request
| URL | Method |
| - | - |
| https://www.twinmotion.com/id/api/sso?sid=a4fe5b24e8e5403f9607715435a8570e&next=fortnite | `GET` |

# Cookies
- `XSRF-TOKEN`: This is the main csrf token that can be used to bypass CSRF policys on the Epic Games Service's
- `EPIC_SESSION_AP`: This is the main session token that is generated with a call that allows CSRF bypassing/generating.