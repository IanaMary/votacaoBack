import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Voto } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, voto

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  voto = await Voto.create({ user })
})

test('POST /votos 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, idUsuario: 'test', idVotacao: 'test', idCandidato: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.idUsuario).toEqual('test')
  expect(body.idVotacao).toEqual('test')
  expect(body.idCandidato).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /votos 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /votos 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /votos 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /votos 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /votos/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${voto.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(voto.id)
})

test('GET /votos/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${voto.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /votos/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${voto.id}`)
  expect(status).toBe(401)
})

test('GET /votos/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
