# Location
The location API is legit what is says. It records the location of the IP and sends the data to the user letting him/her know where the login attempt was made from.

## Request
| URL | Method |
| - | - |
| https://www.epicgames.com/id/api/location | `GET` |

## Response
```json
{
    "country": "US",
    "city": "Chicago",
    "coordinates": {
        "accuracy_radius": 5,
        "latitude": 41.9704,
        "longitude": -87.7036,
        "metro_code": 602,
        "time_zone": "America/Chicago"
    }
}
```