import 'dotenv/config';
import { getSecret, validateSecretReference } from './onepassword.js';
import { encryptForRenovate, validatePublicKey } from './encryption.js';

/**
 * Main function to fetch a secret from 1Password and encrypt it for Renovate
 */
const main = async () => {
  try {
    // Get configuration from environment variables
    const secretReference = process.env.OP_SECRET_REFERENCE;
    const organization = process.env.RENOVATE_ORG;
    const repository = process.env.RENOVATE_REPO;
    const publicKeyString = process.env.PGP_PUBLIC_KEY;

    // Validate required environment variables
    if (!secretReference) {
      throw new Error('Secret reference is required. Please set OP_SECRET_REFERENCE environment variable.');
    }
    
    if (!organization) {
      throw new Error('Organization is required. Please set RENOVATE_ORG environment variable.');
    }
    
    if (!publicKeyString) {
      throw new Error('PGP public key is required. Please set PGP_PUBLIC_KEY environment variable.');
    }
    
    // Validate secret reference format
    const isValidReference = await validateSecretReference(secretReference);
    if (!isValidReference) {
      throw new Error(`Invalid secret reference format: ${secretReference}. Format should be op://vault/item/field`);
    }
    
    // Validate PGP public key
    const isValidKey = await validatePublicKey(publicKeyString);
    if (!isValidKey) {
      throw new Error('Invalid PGP public key format');
    }
    

    
    // Fetch the secret from 1Password
    const secretValue = await getSecret(secretReference);

    

    
    // Encrypt the secret for Renovate
    const encryptedValue = await encryptForRenovate(
      organization,
      repository,
      secretValue,
      publicKeyString
    );
    
    process.stdout.write(encryptedValue);
    
  } catch (error) {
    process.stderr.write(`Error: ${error.message}
`);
    process.exit(1);
  }
};

// Run the main function
main();
