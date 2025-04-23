// Crypto tools for encrypting and decrypting messages
export function encryptMessage(message) {
  // Simple encryption logic (replace with a robust method in production)
  return btoa(message);
}

export function decryptMessage(encryptedMessage) {
  // Simple decryption logic
  return atob(encryptedMessage);
}