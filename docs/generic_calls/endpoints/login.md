# Login
The login API is the user data input section. This is where the user logs in to his/her account and is able to access full features of the EOS (Epic Online Services).

## Request
| URL | Method |
| - | - |
| https://www.epicgames.com/id/api/login | `POST` |

```json
{
  "password": "PASSWORD",
  "rememberMe": true,
  "captcha": "FINAL CAPTCHA TOKEN",
  "email": "EMAIL"
}
```

# Payload
- `password`: The users password
- `rememberMe`: If you want Epic to remember your login details for next use
- `captcha`: The final Hcaptcha token
- `email`: The users email