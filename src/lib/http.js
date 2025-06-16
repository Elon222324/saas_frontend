// FILE: src/lib/http.js
import { authFetch } from './authFetch'

const json = async (res) => {
  if (!res.ok) throw new Error('HTTP error ' + res.status)
  return res.json()
}

export const get = (url, params) => {
  const search = params ? '?' + new URLSearchParams(params).toString() : ''
  return authFetch(url + search).then(json)
}

export const post = (url, body) =>
  authFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(json)

export const patch = (url, body) =>
  authFetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(json)

export const del = (url) =>
  authFetch(url, { method: 'DELETE' }).then(json)
