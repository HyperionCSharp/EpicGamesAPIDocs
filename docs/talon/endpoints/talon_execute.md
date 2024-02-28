# Talon Execute Request
After gathering the session data from [talon_init](https://github.com/HyperionCSharp/EpicGamesAPIDocs/blob/main/docs/talon/endpoints/talon_init.md), we will now ask the server to send us the needed talon data to solve the `HSW` side of the captcha!

*Updated 02/28/24*

## Request
| URL | Method |
| - | - |
| https://talon-service-prod.ecosec.on.epicgames.com/v1/init/execute | `POST` |

```json
{
  "session": {
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
  },
  "v": 1,
  "xal": "",
  "ewa": "b",
  "kid": "p98hck"
}
```

# Response
```json
{
    "h_captcha": {
        "data": "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kR9KoNdsPLleqvr0"
    }
}
```

## Payload
- `xal`: XAL (Cross-Account Lien) identifier.
- `signature`: Signature for the session.
- `site_key`: Site key for hCaptcha.
- `id`: Unique identifier for the session.
- `sdk_base_url`: Base URL for the hCaptcha SDK.
- `timestamp`: Timestamp of the session.

Want to continue with sloving the captcha goto [solved_hcaptcha]()
