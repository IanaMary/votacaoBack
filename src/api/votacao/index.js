import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Votacao, { schema } from './model'

const router = new Router()
const { nome, descricao, dataInicio, dataFim, candidatos } = schema.tree

/**
 * @api {post} /votacoes Create votacao
 * @apiName CreateVotacao
 * @apiGroup Votacao
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam nome Votacao's nome.
 * @apiParam descricao Votacao's descricao.
 * @apiParam dataInicio Votacao's dataInicio.
 * @apiParam dataFim Votacao's dataFim.
 * @apiParam candidatos Votacao's candidatos.
 * @apiSuccess {Object} votacao Votacao's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Votacao not found.
 * @apiError 401 admin access only.
 */
router.post('/',
  token({ required: true, roles: ['admin'] }),
  body({ nome, descricao, dataInicio, dataFim, candidatos }),
  create)

/**
 * @api {get} /votacoes Retrieve votacaos
 * @apiName RetrieveVotacaos
 * @apiGroup Votacao
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of votacaos.
 * @apiSuccess {Object[]} rows List of votacaos.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /votacoes/:id Retrieve votacao
 * @apiName RetrieveVotacao
 * @apiGroup Votacao
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} votacao Votacao's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Votacao not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /votacoes/:id Update votacao
 * @apiName UpdateVotacao
 * @apiGroup Votacao
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiParam nome Votacao's nome.
 * @apiParam descricao Votacao's descricao.
 * @apiParam dataInicio Votacao's dataInicio.
 * @apiParam dataFim Votacao's dataFim.
 * @apiParam candidatos Votacao's candidatos.
 * @apiSuccess {Object} votacao Votacao's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Votacao not found.
 * @apiError 401 admin access only.
 */
router.put('/:id',
  token({ required: true, roles: ['admin'] }),
  body({ nome, descricao, dataInicio, dataFim, candidatos }),
  update)

/**
 * @api {delete} /votacoes/:id Delete votacao
 * @apiName DeleteVotacao
 * @apiGroup Votacao
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Votacao not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true, roles: ['admin'] }),
  destroy)

export default router
