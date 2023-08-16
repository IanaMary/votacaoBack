import { success, notFound } from '../../services/response/'
import { Votacao } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Votacao.create({ ...body, user })
    .then((votacao) => votacao.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Votacao.count(query)
    .then(count => Votacao.find(query, select, cursor)
      .then((votacaos) => ({
        count,
        rows: votacaos.map((votacao) => votacao.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Votacao.findById(params.id)
    .then(notFound(res))
    .then((votacao) => votacao ? votacao.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Votacao.findById(params.id)
    .then(notFound(res))
    .then((votacao) => votacao ? Object.assign(votacao, body).save() : null)
    .then((votacao) => votacao ? votacao.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Votacao.findById(params.id)
    .then(notFound(res))
    .then((votacao) => votacao ? votacao.remove() : null)
    .then(success(res, 204))
    .catch(next)
