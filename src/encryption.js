import * as openpgp from 'openpgp';

/**
 * Encrypts a value for Renovate using OpenPGP
 * @param {string} organization - The GitHub organization name
 * @param {string} repository - The GitHub repository name (optional)
 * @param {string} value - The secret value to encrypt
 * @param {string} publicKeyString - The PGP public key to use for encryption
 * @returns {Promise<string>} The encrypted value
 */
export const encryptForRenovate = async (organization, repository, value, publicKeyString) => {
  try {
    if (!organization || !value || !publicKeyString) {
      throw new Error('Organization, value, and public key are required');
    }

    // Create the data object in the format expected by Renovate
    const data = {
      o: organization,
      r: repository || '',
      v: value
    };

    // Read the public key
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyString });

    // Configure OpenPGP with recommended settings for v6
    const config = {
      preferredHashAlgorithm: openpgp.enums.hash.sha512, // Default in v6
      allowMissingKeyFlags: true // Allow keys without key flags
    };

    // Encrypt the data
    let encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: JSON.stringify(data) }),
      encryptionKeys: publicKey,
      config
    });

    // Format the encrypted message as required by Renovate
    encrypted = encrypted.replace(/(\n)/gm, '');
    encrypted = encrypted.replace('-----BEGIN PGP MESSAGE-----', '');
    encrypted = encrypted.replace('-----END PGP MESSAGE-----', '');
    encrypted = encrypted.split('=')[0];

    return encrypted;
  } catch (error) {

    throw error;
  }
};

/**
 * Validates if a PGP public key is valid
 * @param {string} publicKeyString - The PGP public key to validate
 * @returns {Promise<boolean>} True if the key is valid
 */
export const validatePublicKey = async (publicKeyString) => {
  try {
    // Configure OpenPGP with recommended settings for v6
    const config = {
      allowMissingKeyFlags: true, // Allow keys without key flags
      enableParsingV5Entities: true // Enable parsing of v5 keys if present
    };
    
    await openpgp.readKey({ 
      armoredKey: publicKeyString,
      config
    });
    return true;
  } catch (error) {

    return false;
  }
};
