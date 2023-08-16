import { success, notFound, authorOrAdmin } from '../../services/response/'
import { ContasEntrada } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  ContasEntrada.create({ ...body, user })
    .then((contasEntrada) => contasEntrada.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  ContasEntrada.count(query)
    .then(count => ContasEntrada.find(query, select, cursor)
      .populate('user')
      .then((contasEntradas) => ({
        count,
        rows: contasEntradas.map((contasEntrada) => contasEntrada.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  ContasEntrada.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((contasEntrada) => contasEntrada ? contasEntrada.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  ContasEntrada.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((contasEntrada) => contasEntrada ? Object.assign(contasEntrada, body).save() : null)
    .then((contasEntrada) => contasEntrada ? contasEntrada.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  ContasEntrada.findById(params.id)
    .then(notFound(res))
    .then((contasEntrada) => contasEntrada ? contasEntrada.remove() : null)
    .then(success(res, 204))
    .catch(next)
