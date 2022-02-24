# Talon Init Request
Before accessing anything `Hcaptcha` related you must call the login prod!
This will generate you a lot of json code in the response so lets break it down!!

Before calling this API you must generate a `XSRF-TOKEN` from https://www.epicgames.com/id/api/csrf as a `GET` with no payload. The token will be generated in the cookies!

## Request
| URL | Method |
| - | - |
| https://talon-service-prod.ecosec.on.epicgames.com/v1/init | `POST` |

```json
{
    {"flow_id":"login_prod"}
}
```

## Response
```json
{
    "session": {
        "version": 1,
        "id": "4b7c198e-d871-466f-91de-5f0b192ce7b3",
        "flow_id": "login_prod",
        "ip_address": "callers ip address",
        "timestamp": "2022-02-24T21:02:25.799600317Z",
        "plan": {
            "mode": "h_captcha",
            "h_captcha": {
                "plan_name": "h_captcha_login_prod",
                "site_key": "91e4137f-95af-4bc9-97af-cdcedce21c8c"
            }
        },
        "config": {
            "h_captcha_config": {
                "sdk_base_url": "https://js.hcaptcha.com"
            }
        }
    },
    "signature": "o8xzGMXaH52vARSxFOSvovzAvtSr3P5/00zh8fk/qf8="
}
```