# Game Client on the Epic Games Store

When using a game client connected through the Epic Games Store, the game client must use the ``exchange_code`` grant type to get an access token, passing their client credentials and the code passed to the game from the launcher.

During development, you can also use the password grant type, which will allow the game client to authenticate against Epic Services without the launcher integration.

When the game is started by the Epic Games Launcher, it will be launched with the following command-line parameters:

- `AUTH_LOGIN`: Unused for exchange code.
- `AUTH_PASSWORD`: The credentials to be used by the game client. This will include the exchange code that will be passed to the authentication server.
- `epicapp`: Internal application name.
- `epicenv`: Enviorment that this is being launched in (always `Prod`).
- `epicusername`: Display name of the account that is authenticated in the launcher.
- `epicuserid`: Epic Account ID for the account that is authenticated in the launcher.
- `epiclocale`: Preferred locale based on user preference or based on the system language.
- `epicovt`: Full path to a file containing Ownership Verification Token information.

The following is a sample of the command line parameters passed by the launcher:

```
-AUTH_LOGIN=unused -AUTH_PASSWORD=ed642dfd4e6f47bf8354caf1bcab2fc2 -AUTH_TYPE=exchangecode -epicapp=[AppName] -epicenv=Prod -epicusername="DisplayName" -epicuserid=ab1f86d911d74f4aa8399849e9ca9aa5 -epiclocale=en-US
-epicovt="C:/AppName/.egstore/ab1f86d911d74f4aa8399849e9ca9aa5/File.ovt"
```