# Get Captcha Request
The final stage in solving hCaptcha involves the `getcaptcha` API endpoint. By integrating all previously gathered data into this API call, we can obtain the solved JWT (JSON Web Token) captcha token.

## Request
| URL | Method | Headers |
| - | - | - |
| https://hcaptcha.com/getcaptcha | `POST` | Content-Type: application/json |

## Request Body
```json
{
  "sitekey": "91e4137f-95af-4bc9-97af-cdcedce21c8c",
  "host": "www.epicgames.com",
  "n": "<hsw solution>",
  "c": "<challenge data>",
  "motionData": {
    "st": 1645736671,
    "dct": 1645736671,
    "mm": [[202,197,1645736671],[185,180,1645736672]],
    "md": [[185,180,1645736673]],
    "mu": [[185,180,1645736674]],
    "topLevel": {
      "st": 1645736670,
      "sc": {
        "availWidth": 1920,
        "availHeight": 1080,
        "width": 1920,
        "height": 1080,
        "colorDepth": 24,
        "pixelDepth": 24,
        "availLeft": 0,
        "availTop": 0
      },
      "nv": {
        "hardwareConcurrency": 8,
        "deviceMemory": 8,
        "platform": "Win32",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36",
        "webdriver": false
      },
      "dr": "",
      "inv": false,
      "exec": false,
      "wn": [[1645736670,1920,1080,1920,1080,0,0]]
    }
  }
}

## Response

```json
{
    "c": {
        "type": "hsw",
        "req": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzIjoyLCJ0IjoidyIsImQiOiJOSElHTVRGMDJDeVdpMXF6aW5pK0kxdTJ6ZXFTL2NQbFRQNzUyVFg4Smtrd3g5RG4wUllWNnFPYTZRWkVkUEFoTW1ReHh6d3drblh0QmcrUzBmWmwvMEovejVWQjVJVFdvN1ZMMUhBRUVrb01TWms5VGFZRjV6UFZzZ3MyN1hIbTdXVjg4Z0FFTFlOenZxajlXaGRwMnRWbGZVRW4yZUdGeGk4b3A3SHhhTTIrTHpsV2xxK3dlNUo4RGc9PU56MzJRK0krRkpkQmdJMWsiLCJsIjoiaHR0cHM6Ly9uZXdhc3NldHMuaGNhcHRjaGEuY29tL2MvNDg1ZDI2ODkiLCJlIjoxNjQ1NzM2NzkxfQ.b_ygUVUbcOvObiDHZt_QzThgmR6gxGsonvRo-vG20k8"
    },
    "pass": true,
    "generated_pass_UUID": "P0_eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXNza2V5IjoianJSa3ZCZS9oMEdUZlZaL0RWcDRDKzhEb0JqS0hjeTVRRWYzamJNMEEyNXFpOTgxVmlSakQvWHRydG4rc0tJZEJ0RGptQVhqOE9aSjdtYWdaWUJpUVI3VVFBOWRGclBUdjg2cmMzMG1vdm1CTGJxeHp3MVRuMjhNR21uTnVXNTFFZkVxZ0RSY3ZCdEtTa25FMkFiRVd0WEx6dnVtRTh6R0krWVBxQ3JKaGVvOTAvWUNYWFlSU0tNTHlNY1RUV2hack5rWDJ0STRTL2g3dWZtSnFKNkswdzVsalIzZnBQb09RVldRblFOK2NHNE5mWEZ0VlVvWXZZVzRYV2p5cEdKVTNaUE9mVzRFd3Y2cmNXR3IrQmRvbjdRR3p0V2IzZ1RaUUJnT09MUGNTZWtyejl6R20vMlo5dXdycWVZU2hOQ1A2MHZ5S2dwWWJ3SHVJMnFYdDdjQytUQSt2YjlKQjB5Z015akF5UFVyaTB6TlNNVEY4UlJnSEx6eURVNG5ZYTJ2ekdDOTVyUkN3WWs3c2EwYkhPeFBWVVBzUFpyZUoydEZvSndZZ0NwaHF1bmNBUWRlMThYVmR5QUo0RGVXYVIzRGY5UGxJTWJkVzE5K2J4OVNOSndWK0ZtYythVk9hUzhyQ1hzeGtidFl3TEg2RVZIMWM1SHprZThIOFBxeStiamtzNGJrc1l1OHBzY0tWWnBpb0JnSkZTMkZ6MmNmUytuVVgxUndKUDlyanBjUTd3SXNJM3hNcGQ3dHdLNkczWFl5VnA2UHphS3NrcjVjTGpoaSs1cXlCc094d2FMWHRnaVdXeDAwUDR1SWZoMThXQTdHcXhGdTdLT1NtWTVoQmpCZWFjbGpHYVh4TkVueEdXTlg0Zk5Oc0g3ME9mbndTVUF6ZXVubzNPdytZRWhXWGdBWG50K1pMRlU1d0dvVWZvUlBRY1FmcmVINTNxc2VyekJJbXlhaDNhU1dCSjdtbEYrSStFZ096bW91b0NzVUZyV0FVSWtEVXdUWTc0MVNqMXRnRHkrNHhHY2poczNDZEZibkFSMEx6bGR5bS9CK3lEZVNCb3BsUG9QZzJOajc4MklrNnN3am94Z3dxZjRzVDNYRU5FdlV6T3ZLeFQvQkRQeURBWFBFSTNaNmVEU0RNMWZLbU50a013WmgxSDlHTndvc2tHZVgrRXFIVVNlcG5rQkRHWUROMWlEY01JMmxCZ013ajkrMFQxRGFOYzVnNUdWd3R2bXN0dTh4aDdmQTNSMDVVYWFqanc3Q0V4MTY0a2ZUaUd6dS9IR3NBR0E4ZDM2UDJnUmFLSk1uK25adlMwSlNIbUZ6S3FUUkcxUnlMN2p5Y2ovZDRuTlp",
    "expiration": 120
}
```

If you get the generated_pass_UUID than congrats you have solved hcaptcha and fucked Epic Games at the same time :0

# 2nd Method (solving)
This method will solve hcaptcha but is not a bypass. This takes the task keys and image urls and checks them and solves and in return gets the true : false ids.

TO LEARN MORE ON THE SECOND METHOD CLICK BELOW LINK
[Check_Captcha](https://github.com/HyperionCSharp/EpicGamesAPIDocs/blob/main/docs/hcaptcha/endpoints/check_captcha.md)
