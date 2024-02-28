# Check Site Config Request
If we want to solve hcaptcha we have to gather the needed data to repersent the captcha token!

*Updated 02/28/24*

## Request
| URL | Method |
| - | - |
| https://api2.hcaptcha.com/checksiteconfig?v=fadb9c6&host=www.epicgames.com&sitekey=5928de2d-2800-4c58-be91-060e5a6aa117&sc=1&swa=1&spst=1 | `POST` |

## Query Parameters
- `v`: This could be a version identifier or a unique identifier for the request.
- `host`: This specifies the host or domain for which the configuration is being checked, in this case, *www.epicgames.com*.
- `sitekey`: This is likely the site key associated with the hCaptcha service for the specified website (www.epicgames.com)
- `sc`: This could be a parameter indicating some form of "site configuration" check.
- `swa`: This might indicate a check for "single-word answers" or something similar.
- `spst`: This could be related to "spam prevention" or a similar feature.

Hcaptcha updated API to `POST` it will now need all query params to be sent in order for it to return token. **HSW TOKEN HAS NOT CHANGED SINCE UPDATE**

Example of post payload:
```v=fadb9c6&host=www.epicgames.com&sitekey=91e4137f-95af-4bc9-97af-cdcedce21c8c&sc=1&swa=1&spst=1```

## Response
```json
{
    "pass": true,
    "c": {
        "type": "hsw",
        "req": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzIjoyLCJ0IjoidyIsImQiOiJ4enpWVWFsa2YzN05KciszN1YzNHpFc2JHeVY3M1dNWWhydkdPMnNRbWtzVlF2TTZDMmJEMXliM1VDNzdHLzBGemo3aXZCaGd1Y1dvRjFLd29jK1hMN1YrcVREK1hobk9XYXF0UXk3Q2ZvNStRdVB2ZDBxVVVZbW9xVnlvMWlZcjJoM2gwbGs1bU1mR045RVBybWhhRVRJUkkyNlR6bW5Bd3hhNXN6UEEwS3dYdnpUdlIyS25mSitOZkE9PXBYTWR6b3dqckpUY0Q4U2giLCJsIjoiaHR0cHM6Ly9uZXdhc3NldHMuaGNhcHRjaGEuY29tL2MvNDg1ZDI2ODkiLCJlIjoxNjQ1NzM2Nzg4fQ.-f9uKnR6B0sDEXD9caOV5hxEs8ODrbvCsUcezB9GXr8"
    }
}
```

If ``pass = true`` than this part of reciving hcaptcha required data is complete! Continue to the next hcaptcha endpoint to keep going!
