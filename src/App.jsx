import React, { useState } from "react";
import { scrypt } from "scrypt-js";
// import crypto from "crypto-browserify";
import { Buffer } from "buffer";

const PASSWORD_HASH_OPTIONS = {
  N: 1024*32, // CPU/memory cost parameter (must be a power of 2, > 1)
  r: 8, // block size parameter
  p: 5, // parallelization parameter
  dkLen: 32, // length of derived key
};

function PasswordHasher() {
  const [percentage, setPercentage] = useState(0)
  const [period, setPeriod] = useState('')
  const [password, setPassword] = useState("can-change-this");
  const [hashedPassword, setHashedPassword] = useState("");

  async function handleHashPassword() {
    setHashedPassword('')
    setPeriod('')
    try {
      // Convert password string to a buffer
      const passwordBuffer = Buffer.from(password);

      // Generate a random salt
      const salt = Buffer.from("cocktail-party");

      const start = performance.now();
      // Hash the password using SCrypt
      const hashBuffer = await scrypt(
        passwordBuffer,
        salt,
        PASSWORD_HASH_OPTIONS.N,
        PASSWORD_HASH_OPTIONS.r,
        PASSWORD_HASH_OPTIONS.p,
        PASSWORD_HASH_OPTIONS.dkLen,
        (p) => {
          setPercentage(Math.floor(p * 100))
        }
      );
      const end = performance.now();
      setPeriod((end - start)/1000)

      // Convert the buffer to hex format for readable display
      const hashedHex = Buffer.from(hashBuffer).toString("hex");

      // Update state with the hashed password
      setHashedPassword(hashedHex);
    } catch (error) {
      console.error("Error hashing password:", error);
    }
  }

  return (
    <div>
      <div>{JSON.stringify(PASSWORD_HASH_OPTIONS, null, 2)}</div>

      <div>
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <button onClick={handleHashPassword}>Hash</button>
      </div>

      <div>percentage: {percentage}</div>
      <div>period: {period}</div>
      <div>
      {hashedPassword && (
        <div>
          <strong>Hashed Password:</strong>
          <code style={{ display: "block", marginTop: "10px" }}>
            {hashedPassword}
          </code>
        </div>
      )}
      </div>
    </div>
  );
}

export default PasswordHasher;
