// for frontend fake auth token


const b64url = (obj: any) =>
  btoa(JSON.stringify(obj)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')

export const makeJwt = (payload: Record<string, any>) => {
  const header = { alg: 'HS256', typ: 'JWT' }
  return `${b64url(header)}.${b64url(payload)}.signature` // 伪签名
}

export const FAKE_ACCESS = makeJwt({
  sub: '1', username: 'alice',
  iat: Math.floor(Date.now()/1000),
  exp: Math.floor(Date.now()/1000) + 60*60
})
export const FAKE_REFRESH = makeJwt({
  sub: '1', type: 'refresh',
  iat: Math.floor(Date.now()/1000),
  exp: Math.floor(Date.now()/1000) + 60*60*24
})
