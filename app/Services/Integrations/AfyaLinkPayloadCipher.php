<?php

namespace App\Services\Integrations;

use RuntimeException;

/** Implements the documented AfyaLink AES-256-CBC + RSA-OAEP payload envelope. */
class AfyaLinkPayloadCipher
{
    public function encrypt(array|string $payload, string $providerPublicKey): string
    {
        $publicKey = openssl_pkey_get_public($providerPublicKey);
        if ($publicKey === false) throw new RuntimeException('The configured provider public key is invalid.');

        $json = is_string($payload) ? $payload : json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);
        $aesKey = random_bytes(32);
        $iv = random_bytes(16);
        $ciphertext = openssl_encrypt($json, 'aes-256-cbc', $aesKey, OPENSSL_RAW_DATA, $iv);
        if ($ciphertext === false) throw new RuntimeException('AfyaLink payload encryption failed.');

        $encryptedKey = '';
        $encryptedIv = '';
        if (! openssl_public_encrypt(base64_encode($aesKey), $encryptedKey, $publicKey, OPENSSL_PKCS1_OAEP_PADDING)
            || ! openssl_public_encrypt(base64_encode($iv), $encryptedIv, $publicKey, OPENSSL_PKCS1_OAEP_PADDING)) {
            throw new RuntimeException('AfyaLink RSA encryption failed. Verify the provider public key and its supported key size.');
        }

        $envelope = base64_encode(base64_encode($encryptedKey) . ':' . base64_encode($encryptedIv) . ':' . base64_encode($ciphertext));
        return $envelope;
    }

    public function decrypt(string $envelope, string $privateKeyPem): string
    {
        $privateKey = openssl_pkey_get_private($privateKeyPem);
        if ($privateKey === false) throw new RuntimeException('The configured clinic private key is invalid.');
        $decoded = base64_decode($envelope, true);
        if ($decoded === false) throw new RuntimeException('The encrypted AfyaLink response envelope is not valid Base64.');
        $parts = explode(':', $decoded);
        if (count($parts) !== 3) throw new RuntimeException('The encrypted AfyaLink response envelope has an invalid format.');

        $encryptedKey = base64_decode($parts[0], true);
        $encryptedIv = base64_decode($parts[1], true);
        $ciphertext = base64_decode($parts[2], true);
        if ($encryptedKey === false || $encryptedIv === false || $ciphertext === false) throw new RuntimeException('The encrypted AfyaLink response envelope contains invalid Base64 data.');

        $keyText = '';
        $ivText = '';
        if (! openssl_private_decrypt($encryptedKey, $keyText, $privateKey, OPENSSL_PKCS1_OAEP_PADDING)
            || ! openssl_private_decrypt($encryptedIv, $ivText, $privateKey, OPENSSL_PKCS1_OAEP_PADDING)) {
            throw new RuntimeException('AfyaLink response key decryption failed.');
        }
        $aesKey = base64_decode($keyText, true);
        $iv = base64_decode($ivText, true);
        if ($aesKey === false || $iv === false || strlen($aesKey) !== 32 || strlen($iv) !== 16) throw new RuntimeException('AfyaLink response key material is invalid.');

        $plaintext = openssl_decrypt($ciphertext, 'aes-256-cbc', $aesKey, OPENSSL_RAW_DATA, $iv);
        if ($plaintext === false) throw new RuntimeException('AfyaLink response decryption failed.');
        return $plaintext;
    }
}
