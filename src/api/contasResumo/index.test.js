import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { ContasResumo } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, contasResumo

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  contasResumo = await ContasResumo.create({ user })
})

test('POST /contasResumos 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, totalPagar: 'test', totalPago: 'test', totalRecebido: 'test', totalCaixa: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.totalPagar).toEqual('test')
  expect(body.totalPago).toEqual('test')
  expect(body.totalRecebido).toEqual('test')
  expect(body.totalCaixa).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /contasResumos 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /contasResumos 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
  expect(typeof body[0].user).toEqual('object')
})

test('GET /contasResumos 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /contasResumos/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${contasResumo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(contasResumo.id)
  expect(typeof body.user).toEqual('object')
})

test('GET /contasResumos/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${contasResumo.id}`)
  expect(status).toBe(401)
})

test('GET /contasResumos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /contasResumos/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${contasResumo.id}`)
    .send({ access_token: userSession, totalPagar: 'test', totalPago: 'test', totalRecebido: 'test', totalCaixa: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(contasResumo.id)
  expect(body.totalPagar).toEqual('test')
  expect(body.totalPago).toEqual('test')
  expect(body.totalRecebido).toEqual('test')
  expect(body.totalCaixa).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /contasResumos/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${contasResumo.id}`)
    .send({ access_token: anotherSession, totalPagar: 'test', totalPago: 'test', totalRecebido: 'test', totalCaixa: 'test' })
  expect(status).toBe(401)
})

test('PUT /contasResumos/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${contasResumo.id}`)
  expect(status).toBe(401)
})

test('PUT /contasResumos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, totalPagar: 'test', totalPago: 'test', totalRecebido: 'test', totalCaixa: 'test' })
  expect(status).toBe(404)
})

test('DELETE /contasResumos/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contasResumo.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /contasResumos/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contasResumo.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /contasResumos/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${contasResumo.id}`)
  expect(status).toBe(401)
})

test('DELETE /contasResumos/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
