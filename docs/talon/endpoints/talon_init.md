# Talon Init Request
Before accessing anything `Hcaptcha` related you must call the login prod!
This will generate you a lot of json code in the response so lets break it down!!

*Updated 02/28/24*

Before calling this API you must generate a `XSRF-TOKEN` from https://www.twinmotion.com/id/api/sso?sid=a4fe5b24e8e5403f9607715435a8570e&next=fortnite as a `GET` with no payload. The token will be generated in the cookies!

## Request
| URL | Method |
| - | - |
| https://talon-service-prod.ecosec.on.epicgames.com/v1/init | `POST` |

```json
{
    {"flow_id":"email_exists_prod"}
}
```

## Response
```json
{
    {
  "session": {
    "version": 1,
    "id": "da2ae894-e787-41f5-864a-b66c94ec35b5",
    "flow_id": "email_exists_prod",
    "ip_address": "callers ip address",
    "timestamp": "2024-02-28T20:53:22.500496906Z",
    "plan": {
      "mode": "h_captcha",
      "h_captcha": {
        "plan_name": "h_captcha_email_exists_prod",
        "site_key": "5928de2d-2800-4c58-be91-060e5a6aa117"
      }
    },
    "config": {
      "h_captcha_config": {
        "sdk_base_url": "https://js.hcaptcha.com"
      }
    }
  },
  "signature": "VUWmgdEcpqdw9iw3rcs+fkUC/9Rz2RPSgUyLvZwn4r4="
}
```