# Check Site Config Request
If we want to solve hcaptcha we have to gather the needed data to repersent the captcha token!

## Request
| URL | Method |
| - | - |
| https://hcaptcha.com/checksiteconfig?v=a384235&host=www.epicgames.com&sitekey=91e4137f-95af-4bc9-97af-cdcedce21c8c&sc=1&swa=1 | `GET` |

## Query Parameters
- `v`: the static version of the hcaptcha config
- `host`: www.epicgames.com
- `sitekey`: Epic Games's site key from hcaptcha which is static
- `sc`: the static call version
- `swa`: the static JS file version

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
