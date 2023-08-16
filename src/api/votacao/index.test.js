import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Votacao } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, votacao

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  votacao = await Votacao.create({})
})

test('POST /votacoes 201 (admin)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession, nome: 'test', descricao: 'test', dataInicio: 'test', dataFim: 'test', candidatos: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.nome).toEqual('test')
  expect(body.descricao).toEqual('test')
  expect(body.dataInicio).toEqual('test')
  expect(body.dataFim).toEqual('test')
  expect(body.candidatos).toEqual('test')
})

test('POST /votacoes 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /votacoes 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /votacoes 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /votacoes 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /votacoes/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${votacao.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(votacao.id)
})

test('GET /votacoes/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${votacao.id}`)
  expect(status).toBe(401)
})

test('GET /votacoes/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /votacoes/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${votacao.id}`)
    .send({ access_token: adminSession, nome: 'test', descricao: 'test', dataInicio: 'test', dataFim: 'test', candidatos: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(votacao.id)
  expect(body.nome).toEqual('test')
  expect(body.descricao).toEqual('test')
  expect(body.dataInicio).toEqual('test')
  expect(body.dataFim).toEqual('test')
  expect(body.candidatos).toEqual('test')
})

test('PUT /votacoes/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${votacao.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /votacoes/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${votacao.id}`)
  expect(status).toBe(401)
})

test('PUT /votacoes/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: adminSession, nome: 'test', descricao: 'test', dataInicio: 'test', dataFim: 'test', candidatos: 'test' })
  expect(status).toBe(404)
})

test('DELETE /votacoes/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${votacao.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /votacoes/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${votacao.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /votacoes/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${votacao.id}`)
  expect(status).toBe(401)
})

test('DELETE /votacoes/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
