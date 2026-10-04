package com.hospital.hms.service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;

final class PasswordHasher {
    private static final int ITERATIONS = 210_000;
    private static final SecureRandom RANDOM = new SecureRandom();
    private PasswordHasher() {}
    static String salt() {
        byte[] bytes = new byte[16];
        RANDOM.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }
    static String hash(String password, String salt) {
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), Base64.getDecoder().decode(salt), ITERATIONS, 256);
        try {
            return Base64.getEncoder().encodeToString(SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
                    .generateSecret(spec).getEncoded());
        } catch (Exception e) {
            throw new IllegalStateException("Password hashing is unavailable", e);
        } finally { spec.clearPassword(); }
    }
    static boolean matches(String password, String salt, String expected) {
        return MessageDigest.isEqual(Base64.getDecoder().decode(hash(password, salt)), Base64.getDecoder().decode(expected));
    }
}
