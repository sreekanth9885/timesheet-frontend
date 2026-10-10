
const base64ToBytes = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const copy = new Uint8Array(bytes.length);
  copy.set(bytes);
  return copy.buffer;
};

const bytesToBase64 = (value: ArrayBuffer): string => {
  const bytes = new Uint8Array(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
};

let keyPairPromise: Promise<CryptoKeyPair> | null = null;

const getKeyPair = (): Promise<CryptoKeyPair> => {
  if (!keyPairPromise) {
    keyPairPromise = crypto.subtle
      .generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      )
      .catch((error) => {
        keyPairPromise = null;
        throw error;
      });
  }

  return keyPairPromise;
};

export const getClientPublicKey = async (): Promise<string> => {
  const keyPair = await getKeyPair();
  const publicKey = await crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );

  return bytesToBase64(publicKey);
};

interface PackedEncryptedField {
  k: string; // RSA-encrypted AES key
  i: string; // IV
  t: string; // authentication tag
  d: string; // ciphertext
}

const ENCRYPTED_PROJECT_FIELDS = [
  "name",
  "client_name",
  "description",
  "budget_hours",
  "project_code",
] as const;

export const decryptProjectField = async (
  encryptedValue: string
): Promise<unknown> => {
  const packedJson = new TextDecoder().decode(
    base64ToBytes(encryptedValue)
  );

  const packed = JSON.parse(packedJson) as PackedEncryptedField;

  if (!packed.k || !packed.i || !packed.t || !packed.d) {
    throw new Error("Invalid encrypted project field");
  }

  const keyPair = await getKeyPair();

  // Decrypt the AES key using the browser's private RSA key.
  const aesKeyBytes = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    keyPair.privateKey,
    toArrayBuffer(base64ToBytes(packed.k))
  );

  const aesKey = await crypto.subtle.importKey(
    "raw",
    aesKeyBytes,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  // Web Crypto expects the authentication tag appended to ciphertext.
  const ciphertext = base64ToBytes(packed.d);
  const authTag = base64ToBytes(packed.t);
  const combined = new Uint8Array(ciphertext.length + authTag.length);

  combined.set(ciphertext);
  combined.set(authTag, ciphertext.length);

  const plaintext = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: toArrayBuffer(base64ToBytes(packed.i)),
      tagLength: 128,
    },
    aesKey,
    toArrayBuffer(combined)
  );

  return JSON.parse(new TextDecoder().decode(plaintext));
};

export const decryptProjectData = async <T,>(data: T): Promise<T> => {
  if (Array.isArray(data)) {
    return (await Promise.all(
      data.map((record) => decryptProjectData(record))
    )) as T;
  }

  if (!data || typeof data !== "object") {
    return data;
  }

  const result: Record<string, unknown> = {
    ...(data as Record<string, unknown>),
  };

  for (const field of ENCRYPTED_PROJECT_FIELDS) {
    const value = result[field];

    if (typeof value === "string" && value.length > 0) {
      result[field] = await decryptProjectField(value);
    }
  }

  return result as T;
};
