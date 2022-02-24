# Analytics
This API allows us to request a tracking ID by checking to see if all the data sent so far is valid and needs to be tracked either using Talon or Hcaptcha.

## Request GET Method
| URL | Method |
| - | - |
| https://www.epicgames.com/id/api/analytics | `GET` |

## Request POST Method
| URL | Method |
| - | - |
| https://www.epicgames.com/id/api/analytics | `POST` |

```json
{
    "eventType": "ACCOUNT_LOGIN_OPEN"
}
```

# Response
```json
{
    "trackingUuid": "9646e82a98e04aec8428f4e03292f9cb"
}
```

The tracking UUID tracks the progress of the talon procedures and lets the server know what to do and what to activate at next click.