import { success, notFound, authorOrAdmin } from '../../services/response/'
import { ContasResumo } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  ContasResumo.create({ ...body, user })
    .then((contasResumo) => contasResumo.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  ContasResumo.find(query, select, cursor)
    .populate('user')
    .then((contasResumos) => contasResumos.map((contasResumo) => contasResumo.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  ContasResumo.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((contasResumo) => contasResumo ? contasResumo.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  ContasResumo.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((contasResumo) => contasResumo ? Object.assign(contasResumo, body).save() : null)
    .then((contasResumo) => contasResumo ? contasResumo.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  ContasResumo.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((contasResumo) => contasResumo ? contasResumo.remove() : null)
    .then(success(res, 204))
    .catch(next)

// req é a requisição (request)
// res é o respsota (response)

// export const teste = (req, res) => {
//   ContasEntrada.index(1)
//     .then(notFound(res))
//     .then((contasEntrada) => contasEntrada ? contasEntrada.remove() : null)
//     .then(success(res, 204))
//     // .catch(next)
// }
