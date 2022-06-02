# List of MCPs
Quite a few games by Epic (and other companies) use the MCP in their game. They can then be used to complete operations such as getting the player's current level.

| Game | URL |
| - | - |
| Fortnite | https://fortnite-public-service-prod11.ol.epicgames.com/fortnite |
| Battle Breakers | https://wex-public-service-live-prod.ol.epicgames.com/wex |
| Unreal Tournament | https://ut-public-service-prod10.ol.epicgames.com/ut |
| Infinity Blade | https://sword-service-prod.ol.epicgames.com/sword |
| Spyjinx | https://ocean-public-service-live-prod.ol.epicgames.com/ocean |
| Borderlands 3 | https://oak-public-service-prod.ol.epicgames.com/oak |
| Paragon | https://orion-public-service-prod09.ol.epicgames.com/orion |

When the documentation shows an endpoint as containing `:namespace`, it means you need to combine the URLs by replacing `:namespace` in the endpoint URL with the MCP URL for your chosen MCP.

For example, combining [Get MCP Version](https://github.com/HyperionCSharp/EpicGamesAPIDocs/blob/main/docs/mcp/endpoints/get_mcp_version.md) for `Fortnite` with this would look like:
1) MCP Domain Name: https://fortnite-public-service-prod11.ol.epicgames.com/fortnite
2) Get MCP Version Endpoint: /:namespace/api/version
3) Final URL: https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/version