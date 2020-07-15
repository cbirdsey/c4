import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-ztt9vzsx.us.auth0.com/.well-known/jwks.json'
const cert = `-----BEGIN CERTIFICATE-----
             MIIDDTCCAfWgAwIBAgIJGkZW6CDM5zp4MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
             BAMTGWRldi16dHQ5dnpzeC51cy5hdXRoMC5jb20wHhcNMjAwNzE0MTMwOTQwWhcN
             MzQwMzIzMTMwOTQwWjAkMSIwIAYDVQQDExlkZXYtenR0OXZ6c3gudXMuYXV0aDAu
             Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAto1u3y60hNHEpoSs
             NcMxQZ4LXU22ZEfk2X4w+eL39n/GjtLVChpW4W4bd6lHkGZwAAMW4Oq76dEE+68I
             zirAbmGchmvpyDPYIIBtb9sejJS/LU8fnv09KlkjGPynZVEP6JFd1RvoQZrNqlyG
             uoXdf1tfKHKw5CqENwoUZkiyAuHw79Hdo5deZBzarIctcmwBXyITP+skdUq2U/4F
             /ZU4ibP239wZEjVJjgi2SjFvBzgWTsSoXDiIsXLkPhxYfsfnv4RLa7bLuqttr3X7
             1dS+Rq8R3KBTtFxOR3xSf+psjZSz0EnBQ5uk3kM328uPhMpSlj13gnmqHyex2ymU
             vCRFIQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRS8F7LtzDw
             sRLQ7Cn4jxbRfW0sOjAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
             AIAu8xM30jAqt8NwZ3dqH0r7lKRrAxCwtAzhBGs5uvEUUfSmthVtyz25ObsI8iRb
             T63C9AJWnTfWG1wfAC+4yZQhqYr+kyMU6akJkPazNVasojQm22fPGWy5t2vLIbKK
             QiUilPwuYkELiXZba74LPl+v9mkUVCSJ/xhfMpaPbNSAMWe8t0hTwoZ5ayUnE2+n
             DkVILQWekTnMQN7x9Gzl8tHplD2r325tu87s/CsRZxNBxvY+XR6YRTutHrW1/225
             g7/A+USXkBbwef7S61vCd888KFeE0KtDl7W5Gk4eRoBIdom92UjOKUhFRGma490g
             Tg3iH6maUks/pTjMbig5Cjk=
             -----END CERTIFICATE-----`;

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
 // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
