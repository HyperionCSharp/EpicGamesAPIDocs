# About the hCaptcha Flow in Epic Games

Epic Games transitioned from using Arkose Labs to `hCaptcha` in early 2021, in response to increasing security threats such as `Brute Force`, `Credential Stuffing`, and various `Bypassing` techniques. hCaptcha employs an AI-driven approach that evolves constantly to counter these threats, adapting its challenges and verification methods to stay ahead of malicious actors. This directory provides insights into bypass methods, solving techniques, and interactions with `Cloudflare DDoS protection`, which relies on hCaptcha for bot mitigation.

## Key Public Files

hCaptcha uses `JavaScript` and `TypeScript` to encode and execute captcha challenges. The following files are crucial to its operation:

- **[api.js](https://js.hcaptcha.com/1/api.js?onload=hCaptchaLoaded&render=explicit)**: Renders the captcha challenge upon detecting a login payload by tracking specific IDs.
- **[hcaptcha-challenge.js](https://newassets.hcaptcha.com/captcha/v1/cf234db/hcaptcha-challenge.js)**: Constructs new challenge images, dynamically updating the challenge layout.
- **[hsw.js](https://newassets.hcaptcha.com/c/0d3295f3/hsw.js)**: Critical for generating the captcha token, this file uses a complex set of characters and numbers to create tokens, all starting with `ey`. The final P0 encoded token is produced here.
- **[challenge.js](https://newassets.hcaptcha.com/captcha/challenge/image_label_binary/cf234db/challenge.js)**: Finalizes the captcha token and verifies it via the `https://hcaptcha.com/checkcaptcha` API, ensuring all challenge IDs are correct before generating the login captcha token.

## Detailed Analysis

### **hCaptcha AI Mechanisms**
hCaptcha's AI continuously learns from detected attack patterns, refining its challenges to thwart automated attempts. This constant evolution is pivotal in maintaining robust security against increasingly sophisticated threats.

### **Bypassing Techniques**
This section explores known bypass methods, providing an ongoing analysis of their effectiveness against hCaptcha’s evolving defenses. Techniques are dissected to understand how they exploit hCaptcha’s security, with countermeasures proposed.

### **Interaction with Cloudflare DDoS Protection**
hCaptcha is tightly integrated with Cloudflare's DDoS protection framework, acting as a frontline defense against bots. Understanding this interaction is key to both reinforcing security and exploring potential vulnerabilities in the flow.

## Future Updates

This documentation will be regularly updated to reflect the latest developments in hCaptcha’s technology, emerging threats, and new bypass methods. Contributions and insights from the community are welcome to keep this repository at the forefront of security research.

