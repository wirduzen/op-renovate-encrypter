# Renovate Encrypter

A Node.js application that fetches secrets from 1Password using the official SDK and encrypts them for use with Renovate.

## Features

- Fetches secrets from 1Password using the official 1Password SDK
- Uses modern ES modules and latest JavaScript features
- Encrypts secrets using OpenPGP for Renovate configuration
- Configurable via environment variables

## Prerequisites

- Node.js 18 or higher
- A 1Password account with a service account token
- A Renovate configuration that requires encrypted secrets

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd renovate-encrypter
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` file:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your configuration:
   ```
   # 1Password SDK Configuration
   OP_SERVICE_ACCOUNT_TOKEN=your-service-account-token-here

   # 1Password Secret Reference
   # Format: op://vault-name/item-name/field-name
   OP_SECRET_REFERENCE=op://your-vault/your-item/password

   # Renovate Configuration
   RENOVATE_ORG=your-organization
   RENOVATE_REPO=your-repository-optional

   # PGP Public Key (replace with your public key)
   PGP_PUBLIC_KEY="-----BEGIN PGP PUBLIC KEY BLOCK-----
   ...
   -----END PGP PUBLIC KEY BLOCK-----"
   ```

## Usage

Run the application:

```
npm start
```

The application will:
1. Fetch the secret from 1Password using the provided secret reference
2. Encrypt the secret using the provided PGP public key
3. Output the encrypted value that can be used in your Renovate configuration

## Docker

This project includes a Dockerfile to run the application in a container:

### Building the Docker Image

```bash
docker build -t renovate-encrypter .
```

### Using the Docker Image

The Docker image reads all configuration from environment variables. You can run it using:

```bash
# Using an env file
docker run --env-file .env renovate-encrypter
```

Or by specifying the environment variables directly:

```bash
docker run \
  -e OP_SERVICE_ACCOUNT_TOKEN=your-token \
  -e OP_SECRET_REFERENCE=op://vault/item/field \
  -e RENOVATE_ORG=your-organization \
  -e RENOVATE_REPO=your-repository \
  -e PGP_PUBLIC_KEY="$(cat public-key.asc)" \
  renovate-encrypter
```

The encrypted value will be output to stdout.

## How it Works

1. The application uses the 1Password SDK to securely fetch secrets from your 1Password account
2. It then encrypts the secret using OpenPGP with the Renovate public key
3. The encrypted value is formatted according to Renovate's requirements
4. You can use this encrypted value in your Renovate configuration

## License

MIT
