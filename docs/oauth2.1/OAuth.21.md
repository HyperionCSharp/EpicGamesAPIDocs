## OAuth2.1
This is what I know so far of OAuth2.1

- Resource type ``grant_type=password`` will be omitted from 2.1.
- PKCE will be required for all OAuth clients using the authorization code flow.
- Redirect URIs must be compared using exact string matching.
- The Implicit grant ``(response_type=token)`` is omitted from this specification.
- Bearer token usage omits the use of bearer tokens in the query string of URIs
- Refresh tokens for public clients must either be sender-constrained or one-time use
- The definitions of public and confidential clients have been simplified to only refer to whether the client has credentials

- This is all I know so far and will keep this document updated constantly to the changes and updates!
