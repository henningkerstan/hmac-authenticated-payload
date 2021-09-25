// Project: @henningkerstan/hmac-authenticated-payload
// File: HMACAuthenticatedPayload.ts
//
// Copyright 2021 Henning Kerstan
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createHmac, randomBytes } from 'crypto'

/** A wrapper to authenticate an object (the 'payload') using a SHA3-512 HMAC tag.
 * Computation of the HMAC includes a nonce to support prevention of replay attacks. The input to the HMAC is the concatenation of the nonce, "." and the base64-encoding of the JSON.stringification of the payload.
 */
export class HMACAuthenticatedPayload {
  /** Creates a new (random) 64 byte key to be used as HMAC key. */
  static createKey(): Buffer {
    return randomBytes(64)
  }

  /** Computes the correct HMAC of the supplied payload, nonce.
   * @param key A cryptographic key. Should be exactly 64 bytes long.
   * @param payload Arbitrary JSON-stringifiable data.
   * @param nonce A cryptographic nonce. If no nonce is provided, the current UNIX timestamp (in milliseconds) is used.
   */
  static computeHMAC(
    key: Buffer,
    payload: unknown,
    nonce = Date.now().toString()
  ): string {
    const hmacInput =
      nonce + '.' + Buffer.from(JSON.stringify(payload)).toString('base64')
    const hmac = createHmac('sha3-512', key)
    hmac.update(hmacInput)
    return hmac.digest('base64')
  }

  /** Create a valid HMACAuthenticatedPayload object using the supplied key, payload and (optionally) a user defined nonce. If no nonce is supplied, the current UNIX timestamp (in milliseconds) will be used as nonce.
   * @param key A cryptographic key. Should be exactly 64 bytes long.
   * @param payload Arbitrary JSON-stringifiable data.
   * @param nonce A cryptographic nonce. If no nonce is provided, the current UNIX timestamp (in milliseconds) is used.
   */
  static create(
    key: Buffer,
    payload: unknown,
    nonce = Date.now().toString()
  ): HMACAuthenticatedPayload {
    const ad = new HMACAuthenticatedPayload(
      payload,
      nonce,
      this.computeHMAC(key, payload, nonce)
    )
    return ad
  }

  /** Computes the correct HMAC of the supplied payload, nonce and compares it to the supplied HMAC. Returns true if and only if they coincide. */
  static validate(
    key: Buffer,
    payload: unknown,
    nonce: string,
    hmac: string
  ): boolean {
    return hmac === HMACAuthenticatedPayload.computeHMAC(key, payload, nonce)
  }

  /** Create an HMACAuthenticatedPayload object using the supplied payload, nonce and HMAC.
   * @param payload Arbitrary JSON-stringifiable data.
   * @param nonce A cryptographic nonce.
   * @param hmac An HMAC tag in base64 encoding.
   */
  constructor(payload: unknown, nonce: string, hmac: string) {
    this.payload = payload
    this.nonce = nonce
    this.hmac = hmac
  }

  /** A cryptographic nonce. */
  readonly nonce: string

  /** Arbitrary JSON-stringifiable data. */
  readonly payload: unknown

  /** An HMAC tag in base64 encoding. */
  readonly hmac: string

  /** Computes the correct HMAC of this object and compares it to the stored HMAC. Returns true if and only if they coincide. */
  validate(key: Buffer): boolean {
    return HMACAuthenticatedPayload.validate(
      key,
      this.payload,
      this.nonce,
      this.hmac
    )
  }
}
