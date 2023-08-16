import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export ContasResumo, { schema } from './model'

const router = new Router()
// const express = require('express')
// const app = express()

const { totalPagar, totalPago, totalRecebido, totalCaixa } = schema.tree

/**
 * @api {post} /contasResumos Create contas resumo
 * @apiName CreateContasResumo
 * @apiGroup ContasResumo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam totalPagar Contas resumo's totalPagar.
 * @apiParam totalPago Contas resumo's totalPago.
 * @apiParam totalRecebido Contas resumo's totalRecebido.
 * @apiParam totalCaixa Contas resumo's totalCaixa.
 * @apiSuccess {Object} contasResumo Contas resumo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contas resumo not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ totalPagar, totalPago, totalRecebido, totalCaixa }),
  create)

/**
 * @api {get} /contasResumos Retrieve contas resumos
 * @apiName RetrieveContasResumos
 * @apiGroup ContasResumo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} contasResumos List of contas resumos.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */

// router.get('/teste', (req, res) => {
//   res.json({ messege: 'Hello World\n' })
// })

// router.get('/teste', teste)

router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /contasResumos/:id Retrieve contas resumo
 * @apiName RetrieveContasResumo
 * @apiGroup ContasResumo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} contasResumo Contas resumo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contas resumo not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /contasResumos/:id Update contas resumo
 * @apiName UpdateContasResumo
 * @apiGroup ContasResumo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam totalPagar Contas resumo's totalPagar.
 * @apiParam totalPago Contas resumo's totalPago.
 * @apiParam totalRecebido Contas resumo's totalRecebido.
 * @apiParam totalCaixa Contas resumo's totalCaixa.
 * @apiSuccess {Object} contasResumo Contas resumo's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contas resumo not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ totalPagar, totalPago, totalRecebido, totalCaixa }),
  update)

/**
 * @api {delete} /contasResumos/:id Delete contas resumo
 * @apiName DeleteContasResumo
 * @apiGroup ContasResumo
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Contas resumo not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
