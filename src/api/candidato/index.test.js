import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Candidato } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, candidato

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  candidato = await Candidato.create({})
})

test('POST /candidatos 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, nome: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.nome).toEqual('test')
})

test('POST /candidatos 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /candidatos 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /candidatos 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /candidatos 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /candidatos/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${candidato.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(candidato.id)
})

test('GET /candidatos/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${candidato.id}`)
  expect(status).toBe(401)
})

test('GET /candidatos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /candidatos/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${candidato.id}`)
    .send({ access_token: adminSession, nome: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(candidato.id)
  expect(body.nome).toEqual('test')
})

test('PUT /candidatos/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${candidato.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /candidatos/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${candidato.id}`)
  expect(status).toBe(401)
})

test('PUT /candidatos/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, nome: 'test' })
  expect(status).toBe(404)
})

test('DELETE /candidatos/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${candidato.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /candidatos/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${candidato.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /candidatos/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${candidato.id}`)
  expect(status).toBe(401)
})

test('DELETE /candidatos/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
