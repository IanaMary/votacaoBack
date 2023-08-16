import { success, notFound } from '../../services/response/'
import { Candidato } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Candidato.create(body)
    .then((candidato) => candidato.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Candidato.count(query)
    .then(count => Candidato.find(query, select, cursor)
      .then((candidatoes) => ({
        count,
        rows: candidatoes.map((candidato) => candidato.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Candidato.findById(params.id)
    .then(notFound(res))
    .then((candidato) => candidato ? candidato.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Candidato.findById(params.id)
    .then(notFound(res))
    .then((candidato) => candidato ? Object.assign(candidato, body).save() : null)
    .then((candidato) => candidato ? candidato.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Candidato.findById(params.id)
    .then(notFound(res))
    .then((candidato) => candidato ? candidato.remove() : null)
    .then(success(res, 204))
    .catch(next)
