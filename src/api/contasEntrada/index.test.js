import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { ContasEntrada } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, adminSession, contasEntrada

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  contasEntrada = await ContasEntrada.create({ user })
})

test('POST /contasEntradas 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, nome: 'test', valor: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.nome).toEqual('test')
  expect(body.valor).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /contasEntradas 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /contasEntradas 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /contasEntradas/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${contasEntrada.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(contasEntrada.id)
})

test('GET /contasEntradas/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /contasEntradas/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${contasEntrada.id}`)
    .send({ access_token: userSession, nome: 'test', valor: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(contasEntrada.id)
  expect(body.nome).toEqual('test')
  expect(body.valor).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /contasEntradas/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${contasEntrada.id}`)
    .send({ access_token: anotherSession, nome: 'test', valor: 'test' })
  expect(status).toBe(401)
})

test('PUT /contasEntradas/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${contasEntrada.id}`)
  expect(status).toBe(401)
})

test('PUT /contasEntradas/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, nome: 'test', valor: 'test' })
  expect(status).toBe(404)
})

test('DELETE /contasEntradas/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contasEntrada.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /contasEntradas/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contasEntrada.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /contasEntradas/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contasEntrada.id}`)
  expect(status).toBe(401)
})

test('DELETE /contasEntradas/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
