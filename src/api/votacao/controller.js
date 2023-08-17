import { success, notFound } from '../../services/response/'
import { Votacao } from '.'
import { Voto } from '../voto'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Votacao.create({ ...body, user })
    .then((votacao) => votacao.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = async ({ user, querymen: { query, select, cursor } }, res, next) => {
  try {
    const count = await Votacao.count(query)
    const votacaos = await Votacao.find(query, select, cursor).populate('user').populate('candidatos').lean()

    for await (const votacao of votacaos) {
      const voto = await Voto.find({ idVotacao: votacao._id, user })
      votacao.votou = !!voto
      votacao.id = votacao._id
      delete votacao._id
      votacao.candidatos.forEach(candidato => {
        candidato.id = candidato._id
        delete candidato._id
      })
    }
    return res.json({ count, rows: votacaos })
  } catch (error) {
    next(error)
  }
}

export const show = async ({ params }, res, next) => {
  try {
    const votacao = await Votacao.findById(params.id).populate('candidatos').lean() // Busca a votação pelo id
    if (!votacao) return res.status(404).end()
    votacao.totalVotos = 0
    for await (const candidato of votacao.candidatos) {
      candidato.quantVotos = await Voto.count({ idVotacao: votacao._id, idCandidato: candidato._id }) // Busca a quantidade de votos de cada candidato
      votacao.totalVotos += candidato.quantVotos
    }
    return res.json(votacao)
  } catch (error) {
    next(error)
    console.log(error)
  }
}

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
