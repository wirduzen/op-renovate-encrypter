import sdk from '@1password/sdk';

/**
 * Creates an authenticated 1Password SDK client
 * @returns {Promise<Object>} 1Password SDK client
 */
export const createOpClient = async () => {
  const token = process.env.OP_SERVICE_ACCOUNT_TOKEN;
  
  if (!token) {
    throw new Error('1Password service account token missing. Please set OP_SERVICE_ACCOUNT_TOKEN environment variable.');
  }
  
  return sdk.createClient({
    auth: token,
    integrationName: 'Renovate Encrypter',
    integrationVersion: '1.0.0',
  });
};

/**
 * Fetches a secret from 1Password using a secret reference
 * @param {string} secretReference - The secret reference in the format op://vault/item/field
 * @returns {Promise<string>} The secret value
 */
export const getSecret = async (secretReference) => {
  try {
    if (!secretReference) {
      throw new Error('Secret reference is required. Please set OP_SECRET_REFERENCE environment variable.');
    }
    
    const client = await createOpClient();
    const secretValue = await client.secrets.resolve(secretReference);
    
    if (!secretValue) {
      throw new Error(`Secret not found with reference: ${secretReference}`);
    }
    
    return secretValue;
  } catch (error) {

    throw error;
  }
};

/**
 * Validates a secret reference format
 * @param {string} secretReference - The secret reference to validate
 * @returns {Promise<boolean>} True if the reference is valid
 */
export const validateSecretReference = async (secretReference) => {
  try {
    await sdk.Secrets.validateSecretReference(secretReference);
    return true;
  } catch (error) {

    return false;
  }
};
