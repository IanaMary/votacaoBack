import { success, notFound, authorOrAdmin } from '../../services/response/'
import { ContasSaidas } from '.'
import { ContasEntrada } from '../contasEntrada'
import mongoose from 'mongoose'

export const create = ({ user, bodymen: { body } }, res, next) =>
  ContasSaidas.create({ ...body, user })
    .then((contasSaidas) => contasSaidas.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  ContasSaidas.count(query)
    .then(count => ContasSaidas.find(query, select, cursor)
      .populate('user')
      .then((contasSaidas) => ({
        count,
        rows: contasSaidas.map((contasSaidas) => contasSaidas.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  ContasSaidas.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((contasSaidas) => contasSaidas ? contasSaidas.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  ContasSaidas.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((contasSaidas) => contasSaidas ? Object.assign(contasSaidas, body).save() : null)
    .then((contasSaidas) => contasSaidas ? contasSaidas.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  ContasSaidas.findById(params.id)
    .then(notFound(res))
    .then((contasSaidas) => contasSaidas ? contasSaidas.remove() : null)
    .then(success(res, 204))
    .catch(next)

export const totalResumo = async ({ querymen: { query }, user }, res, next) => {
  try {
    query.user = mongoose.Types.ObjectId(user._id)

    const totalSaidaPromise = ContasSaidas.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: '$pago',
          soma: {
            $sum: '$valor'
          }
        }
      }
    ])

    delete query.pago
    const totalEntradaPromise = ContasEntrada.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: null,
          soma: {
            $sum: '$valor'
          }
        }
      }, {
        $project: {
          _id: 0
        }
      }
    ])

    const [totalSaida, totalEntrada] = await Promise.all([
      totalSaidaPromise,
      totalEntradaPromise
    ])

    let pago = 0
    let pagar = 0
    const entrada = totalEntrada[0]?.soma || 0
    for (const saida of totalSaida) {
      if (saida._id) pago = saida.soma
      else pagar = saida?.soma || 0
    }

    res.send({
      somaPagar: pagar,
      somaPago: pago,
      somaEntrada: entrada,
      caixa: entrada - (pagar + pago)
    })
  } catch (err) {
    res.status(400).send(err)
  }
}

export const totalResumoMensal = async ({ querymen: { query }, user }, res, next) => {

  try {
    query.user = mongoose.Types.ObjectId(user._id)

    const totalResumoSaidaPromisse = ContasSaidas.aggregate(
      [
        {
          $match: query
        },
        {
          $group: {
            _id: '$mes',
            somaMensal: {
              $sum: '$valor'
            }
          }
        }
      ])

    const totalResumoEntradaPromisse = ContasEntrada.aggregate(
      [
        {
          $match: query
        },
        {
          $group: {
            _id: '$mes',
            somaMensal: {
              $sum: '$valor'
            }
          }
        }
      ])

    const [valorSaida, valorEntrada] = await Promise.all([
      totalResumoSaidaPromisse,
      totalResumoEntradaPromisse
    ])

    const meses = ['JAN',
      'FEV',
      'MAR',
      'ABR',
      'MAI',
      'JUN',
      'JUL',
      'AGO',
      'SET',
      'OUT',
      'NOV',
      'DEZ']

    const restult = []
    for (const mes of meses) {
      const posSaida = valorSaida.findIndex((element) => element._id === mes)

      const posEntrada = valorEntrada.findIndex((element) => element._id === mes)

      const obj = {
        mes: mes,
        totalSaida: posSaida !== -1 ? valorSaida[posSaida].somaMensal : 0,
        totalEntrada: posEntrada !== -1 ? valorEntrada[posEntrada].somaMensal : 0
      }
      restult.push(obj)
    }

    res.send(restult)
  } catch (err) {
    res.status(400).send(err)
  }
}

export const totalResumoAnual = async ({ querymen: { query, cursor }, user }, res, next) => {

  try {
    query.user = mongoose.Types.ObjectId(user._id)

    const contadorPromise = ContasEntrada.aggregate(
      [
        {
          $match: query
        },
        {
          $unionWith: {
            coll: 'contassaidas'
          }
        },
        {
          $group: {
            _id: '$ano',
            totalSaida: {
              $sum: {
                $cond: {
                  if: {
                    $or: [{
                      $eq: ['$pago', false]
                    },
                    {
                      $eq: ['$pago', true]
                    }
                    ]
                  },
                  then: '$valor',
                  else: 0
                }
              }
            },
            totalEntrada: {
              $sum: {
                $cond: {
                  if: {
                    $or: [{
                      $eq: ['$pago', false]
                    },
                    {
                      $eq: ['$pago', true]
                    }
                    ]
                  },
                  then: 0,
                  else: '$valor'
                }
              }
            }
          }
        },
        {
          $count: 'count'
        }
      ])

    const totalResumoPromisse = await ContasEntrada.aggregate(
      [
        {
          $match: query
        },
        {
          $unionWith: {
            coll: 'contassaidas'
          }
        },
        {
          $group: {
            _id: '$ano',
            totalSaida: {
              $sum: {
                $cond: {
                  if: {
                    $or: [{
                      $eq: ['$pago', false]
                    },
                    {
                      $eq: ['$pago', true]
                    }
                    ]
                  },
                  then: '$valor',
                  else: 0
                }
              }
            },
            totalEntrada: {
              $sum: {
                $cond: {
                  if: {
                    $or: [{
                      $eq: ['$pago', false]
                    },
                    {
                      $eq: ['$pago', true]
                    }
                    ]
                  },
                  then: 0,
                  else: '$valor'
                }
              }
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }, {
          $skip: cursor.skip
        },
        {
          $limit: cursor.limit
        }
      ])

    const [contador, totalResumo] = await Promise.all([
      contadorPromise,
      totalResumoPromisse
    ])
    res.send({
      count: contador[0].count,
      rows: totalResumo
    })
  } catch (err) {
    res.status(400).send(err)
  }
}
