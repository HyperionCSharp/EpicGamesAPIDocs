# Xbox Login Endpoints
These docs will teach you how the Xbox login thirdpart endpoint on Epic Games works and how to login in and generate a access token using `email:pass` format.

## Generating The State
First thing we must do is generate the `State` Json Web Token(JWT) encoded in base64. You must use the `https://www.epicgames.com/id/api/csrf` and parse the XSRF-TOKEN, and use in the state request below.

## Request
| URL | Method |
| - | - |
| https://www.epicgames.com/id/api/state/xbl | `POST` |

```json
{
  "isPopup": false,
  "isWeb": true,
  "oauthRedirectUrl": "https://epicgames.com/id/login/xbl?prompt="
}
```

## Microsoft Shii
Once the state is generated you must parse the state and make a get request to this API below:

| URL | Method |
| - | - |
| https://login.live.com/oauth20_authorize.srf?client_id=82023151-c27d-4fb5-8551-10c10724a55e&redirect_uri=https%3A%2F%2Faccounts.epicgames.com%2FOAuthAuthorized&state={state}&scope=xboxlive.signin&service_entity=undefined&force_verify=true&response_type=code&display=popup | `GET` |

The response should be HTML/JS code, you will need to parse the `urlPostMsa`, and the `PPFT ID` once done continue with the next request!

Now make a POST request to the `urlPostMsa` url, and use the following payload data:

```
i13=0&login={email}&loginfmt={email}&type=11&LoginOptions=3&lrt=&lrtPartition=&hisRegion=&hisScaleUnit=&passwd={password}&ps=2&psRNGCDefaultType=&psRNGCEntropy=&psRNGCSLK=&canary=&ctx=&hpgrequestid=&PPFT={PPFT}&PPSX=Pa&NewUser=1&FoundMSAs=&fspost=0&i21=0&CookieDisclosure=0&IsFidoSupported=1&isSignupPost=0&i19=59346
```

Once completed you will get a response with a successful account found and it will continue to the next step.

Now parse the `urlPost` url out of the response data from the last API request and use the following payload data to bypass "want to stay signed in?" shii:

```
LoginOptions=1&type=28&ctx=&hpgrequestid=&PPFT={PPFT}&i19=4600
```

To check if the login was successful look for either the `WLSSC` cookie or if the address contains `https://www.epicgames.com/id/oauth-authorized?code` if you get success items head to the next step!

Next parse the `?code=` and `&state=` these are the vital parts to logging into epic and authenticating with online services.

This request will allow us to login to xbl Epic Games using the recently parsed `?code=` !

## Request
| URL | Method |
| - | - |
| https://www.epicgames.com/id/api/external/xbl/login | `POST` |

```json
{
  "code": "{?code=}"
}
```

Once steps are completed you should now have the bearer token of the account you logged in with! Now you can use the exchange grant and than use Oauth API to gain access to profile details and maybe pass some Fortnite endpoints!!!