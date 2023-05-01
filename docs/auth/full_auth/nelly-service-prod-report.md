# Nelly-Service-Prod-Report
Holds Akami, Cloudflare storage and task managment for authentication of the user/users.

## Request
| URL | Method |
| - | - |
| https://nelly-service-prod-cloudflare.ecosec.on.epicgames.com/v1/report | `POST` |

## Post Data
```JSON
{
  "source": "talon",
  "encountered_report_error": false,
  "results": {
    "fastly_small_get": {
      "provider": "fastly",
      "successful": true,
      "performance": {
        "e2e": 366
      }
    },
    "cloudfront_small_get": {
      "provider": "cloudfront",
      "successful": true,
      "performance": {
        "e2e": 211
      }
    },
    "direct_small_get": {
      "provider": "direct",
      "successful": true,
      "performance": {
        "e2e": 344
      }
    },
    "akamai_small_get": {
      "provider": "akamai",
      "successful": true,
      "performance": {
        "e2e": 234
      }
    },
    "cloudflare_small_get": {
      "provider": "cloudflare",
      "successful": true,
      "performance": {
        "e2e": 346
      }
    }
  },
  "provider": "cloudflare"
}
```
