import { success, notFound } from '../../services/response/'
import { Voto } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Voto.create({ ...body, user })
    .then((voto) => voto.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Voto.count(query)
    .then(count => Voto.find(query, select, cursor)
      .populate('user')
      .then((votos) => ({
        count,
        rows: votos.map((voto) => voto.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Voto.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((voto) => voto ? voto.view() : null)
    .then(success(res))
    .catch(next)
