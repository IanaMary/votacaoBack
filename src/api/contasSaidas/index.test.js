import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { ContasSaidas } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, adminSession, contasSaidas

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  contasSaidas = await ContasSaidas.create({ user })
})

test('POST /contasSaidas 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, valor: 'test', nome: 'test', pago: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.valor).toEqual('test')
  expect(body.nome).toEqual('test')
  expect(body.pago).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /contasSaidas 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /contasSaidas 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /contasSaidas/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${contasSaidas.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(contasSaidas.id)
})

test('GET /contasSaidas/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /contasSaidas/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${contasSaidas.id}`)
    .send({ access_token: userSession, valor: 'test', nome: 'test', pago: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(contasSaidas.id)
  expect(body.valor).toEqual('test')
  expect(body.nome).toEqual('test')
  expect(body.pago).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /contasSaidas/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${contasSaidas.id}`)
    .send({ access_token: anotherSession, valor: 'test', nome: 'test', pago: 'test' })
  expect(status).toBe(401)
})

test('PUT /contasSaidas/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${contasSaidas.id}`)
  expect(status).toBe(401)
})

test('PUT /contasSaidas/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, valor: 'test', nome: 'test', pago: 'test' })
  expect(status).toBe(404)
})

test('DELETE /contasSaidas/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contasSaidas.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /contasSaidas/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contasSaidas.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /contasSaidas/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contasSaidas.id}`)
  expect(status).toBe(401)
})

test('DELETE /contasSaidas/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
