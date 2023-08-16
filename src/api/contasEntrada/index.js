import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export ContasEntrada, { schema } from './model'

const router = new Router()
const { nome, valor, ano, mes, user } = schema.tree

/**
 * @api {post} /contasEntradas Create contas entrada
 * @apiName CreateContasEntrada
 * @apiGroup ContasEntrada
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam nome Contas entrada's nome.
 * @apiParam valor Contas entrada's valor.
 * @apiSuccess {Object} contasEntrada Contas entrada's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contas entrada not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ nome, valor, ano, mes }),
  create)

/**
 * @api {get} /contasEntradas Retrieve contas entradas
 * @apiName RetrieveContasEntradas
 * @apiGroup ContasEntrada
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of contas entradas.
 * @apiSuccess {Object[]} rows List of contas entradas.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  token({ required: true }),
  query({ mes, ano, user }),
  index)

/**
 * @api {get} /contasEntradas/:id Retrieve contas entrada
 * @apiName RetrieveContasEntrada
 * @apiGroup ContasEntrada
 * @apiSuccess {Object} contasEntrada Contas entrada's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contas entrada not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /contasEntradas/:id Update contas entrada
 * @apiName UpdateContasEntrada
 * @apiGroup ContasEntrada
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam nome Contas entrada's nome.
 * @apiParam valor Contas entrada's valor.
 * @apiSuccess {Object} contasEntrada Contas entrada's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Contas entrada not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ nome, valor, ano, mes }),
  update)

/**
 * @api {delete} /contasEntradas/:id Delete contas entrada
 * @apiName DeleteContasEntrada
 * @apiGroup ContasEntrada
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Contas entrada not found.
 * @apiError 401 admin access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
